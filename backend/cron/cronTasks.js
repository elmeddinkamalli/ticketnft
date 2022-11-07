const Web3 = require("web3");
const mongoose = require("mongoose");
const axios = require("axios");
const ContractAbi = require("../abi/ticketnft.json");
const fs = require("fs");

const BlockModel = require("../modules/block/blockModel");
const EventModel = require("../modules/event/eventModel");
const UserModel = require("../modules/user/userModel");
const utils = require("../helper/utils");
const TicketModel = require("../modules/ticket/ticketModel");
const TicketDesignModel = require("../modules/ticketDesign/ticketDesignModel");

const addresses = {
  [process.env.ETH_CHAIN_ID]: process.env.ETH_CONTRACT_ADDRESS,
  [process.env.BNB_CHAIN_ID]: process.env.BNB_CONTRACT_ADDRESS,
  [process.env.MATIC_CHAIN_ID]: process.env.MATIC_CONTRACT_ADDRESS,
  [process.env.FTM_CHAIN_ID]: process.env.FTM_CONTRACT_ADDRESS,
};

const _web3 = {
  [process.env.ETH_CHAIN_ID]: new Web3(process.env.ETH_RPC),
  [process.env.BNB_CHAIN_ID]: new Web3(process.env.BNB_RPC),
  [process.env.MATIC_CHAIN_ID]: new Web3(process.env.MATIC_RPC),
  [process.env.FTM_CHAIN_ID]: new Web3(process.env.FTM_RPC),
};

const cronTasks = {};

cronTasks.getCreatedEvents = async (req, res, chainId) => {
  try {
    const latestBlockNo = await _web3[chainId].eth.getBlockNumber();
    const getLastBlock = await BlockModel.findOne(
      { chainId: chainId },
      { createNewEvent: 1 }
    );

    const contract = new _web3[chainId].eth.Contract(
      ContractAbi,
      addresses[chainId]
    );

    let getPastEvents;
    try {
      getPastEvents = await contract.getPastEvents("createNewEvent", {
        // fromBlock: +getLastBlock.createNewEvent,
        fromBlock: latestBlockNo - 100,
        toBlock: latestBlockNo,
      });
    } catch (error) {
      getPastEvents = await contract.getPastEvents("createNewEvent", {
        fromBlock: latestBlockNo - 50,
        toBlock: latestBlockNo,
      });
    }

    if (getPastEvents.length) {
      console.log("New event checking ===>");

      getPastEvents.forEach(async (event) => {
        let savedEvent;
        const eventDetails = await contract.methods
          .idToEvent(event.returnValues.eventId)
          .call();
        if (eventDetails && +eventDetails.id !== 0) {
          let existEvent = await EventModel.findOne({
            eventId: event.returnValues.eventId,
            chainId: chainId,
          });

          if (!existEvent) {
            existEvent = await EventModel.findById(
              event.returnValues.centralizedId
            );
          }

          let ownerExist = await UserModel.findOne({
            walletAddress: eventDetails.creator,
          });

          if (existEvent) {
            existEvent.eventURI = eventDetails.eventURI;
            existEvent.chainId = chainId;
            existEvent.eventURI = eventDetails.eventURI;
            existEvent.maxTicketSupply = +eventDetails.maxSupply;
            existEvent.pricePerTicket = +eventDetails.pricePerTicket;
            (existEvent.eventId = +eventDetails.id),
              (existEvent.isDraft = false);
            savedEvent = await existEvent.save();
          } else {
            savedEvent = await EventModel({
              ownerId: ownerExist ? ownerExist._id : null,
              eventId: +eventDetails.id,
              chainId: chainId,
              eventURI: eventDetails.eventURI,
              maxTicketSupply: +eventDetails.maxSupply,
              pricePerTicket: +eventDetails.pricePerTicket,
              isDraft: false,
            }).save();
          }

          await cronTasks.fetchDetailsFromIpfs(savedEvent._id);
        }
      });
      // getLastBlock.createNewEvent = latestBlockNo;
      // await getLastBlock.save();
    }
  } catch (err) {
    console.log(err.message);
    utils.echoLog(`error in adding new event: ${err.message}`);
  }
};

cronTasks.fetchDetailsFromIpfs = async (id) => {
  try {
    let event = await EventModel.findById(id);

    let response = await fetch(event.eventURI);
    response = await response.json();
    event.image = response.image.replace("https://ipfs.io/ipfs/", "");
    event.eventName = response.name;
    event.description = response.description;
    event.saleStarts = response.saleStarts;
    event.saleEnds = response.saleEnds;

    let eventDesign = await TicketDesignModel.findOne({
      eventId: event._id,
    });

    if (!eventDesign) {
      eventDesign = await TicketDesignModel({
        image: response.ticketImage,
        isDefault: false,
        eventId: event._id,
      }).save();
    }

    event.designId = eventDesign;

    await event.save();
  } catch (error) {
    console.log(error);
    utils.echoLog(
      `error in fetching event details from ipfs: ${error.message}`
    );
  }
};

cronTasks.getCreatedTickets = async (req, res, chainId) => {
  try {
    const latestBlockNo = await _web3[chainId].eth.getBlockNumber();
    const getLastBlock = await BlockModel.findOne(
      { chainId: chainId },
      { mintingEventTicket: 1 }
    );

    const contract = new _web3[chainId].eth.Contract(
      ContractAbi,
      addresses[chainId]
    );

    let getPastEvents;
    try {
      getPastEvents = await contract.getPastEvents("mintingEventTicket", {
        // fromBlock: +getLastBlock.mintingEventTicket,
        fromBlock: latestBlockNo - 100,
        toBlock: latestBlockNo,
      });
    } catch (error) {
      getPastEvents = await contract.getPastEvents("mintingEventTicket", {
        fromBlock: latestBlockNo - 50,
        toBlock: latestBlockNo,
      });
    }

    console.log(getPastEvents.length);

    if (getPastEvents.length) {
      console.log("New ticket checking ===>");

      getPastEvents.forEach(async (ticket) => {
        let savedTicket;
        const eventId = await contract.methods
          .getTicketEvent(ticket.returnValues.tokenId)
          .call();
        if (eventId && eventId != 0) {
          let eventExists = await EventModel.findOne({
            eventId: eventId,
            chainId: chainId,
          });

          if (!eventExists) {
            console.log(
              `event not exists for tokenId: ${ticket.returnValues.tokenId} and eventId: ${eventId}`
            );
            utils.echoLog(
              `event not exists for tokenId: ${ticket.returnValues.tokenId} and eventId: ${eventId}`
            );
            return;
          }

          let ticketExist = await TicketModel.findOne({
            uniqueId: ticket.returnValues.centralizedId,
            chainId: chainId,
          });

          if (!ticketExist) {
            ticketExist = await TicketModel.findOne({
              tokenId: ticket.returnValues.tokenId,
              chainId: chainId,
            });
          }

          let ownerAddress;
          try {
            ownerAddress = await contract.methods
              .ownerOf(ticket.returnValues.tokenId)
              .call();
          } catch (error) {}

          const owner = await UserModel.findOne({
            walletAddress: ownerAddress,
          });

          if (ticketExist) {
            if (!ticketExist.isDraft && !isNaN(ticketExist.tokenId)) {
              console.log(
                `ticket already confirmed: ${ticket.returnValues.tokenId}`
              );
              utils.echoLog(
                `ticket already confirmed: ${ticket.returnValues.tokenId}`
              );
              return;
            } else {
              ticketExist.isDraft = false;
              ticketExist.uniqueId = ticket.returnValues.centralizedId;
              ticketExist.tokenId = ticket.returnValues.tokenId;
              ticketExist.eventId = eventExists._id;
              ticketExist.ownerWalletAddress = ownerAddress;
              if (owner) {
                ticketExist.ownerId = owner._id;
              }
              await ticketExist.save();
            }
          } else {
            const ticketDesign = await TicketDesignModel.findOne({
              eventId: eventExists._id,
            });

            const metadataURI = await contract.methods
              .tokenURI(ticket.returnValues.tokenId)
              .call();

            savedTicket = await TicketModel({
              ownerId: owner ? owner._id : null,
              eventId: eventExists._id,
              chainId: chainId,
              designId: ticketDesign ? ticketDesign._id : null,
              uniqueId: ticket.returnValues.centralizedId,
              tokenId: ticket.returnValues.tokenId,
              ownerWalletAddress: owner.walletAddress,
              metadataURI: metadataURI,
              isDraft: false,
            }).save();

            await cronTasks.fetchDetailsFromIpfsForTicket(savedTicket._id);
          }
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

cronTasks.fetchDetailsFromIpfsForTicket = async (id) => {
  try {
    let ticket = await TicketModel.findById(id);

    let response = await fetch(ticket.metadataURI);
    response = await response.json();
    ticket.image = response.image.replace("https://ipfs.io/ipfs/", "");

    await ticket.save();
  } catch (error) {
    console.log(error);
    utils.echoLog(
      `error in fetching ticket details from ipfs: ${error.message}`
    );
  }
};

cronTasks.getBurningTickets = async (req, res, chainId) => {
  try {
    const latestBlockNo = await _web3[chainId].eth.getBlockNumber();
    const getLastBlock = await BlockModel.findOne(
      { chainId: chainId },
      { burningTicket: 1 }
    );

    const contract = new _web3[chainId].eth.Contract(
      ContractAbi,
      addresses[chainId]
    );

    let getPastEvents;
    try {
      getPastEvents = await contract.getPastEvents("burningTicket", {
        // fromBlock: +getLastBlock.burningTicket,
        fromBlock: latestBlockNo - 100,
        toBlock: latestBlockNo,
      });
    } catch (error) {
      getPastEvents = await contract.getPastEvents("burningTicket", {
        fromBlock: latestBlockNo - 50,
        toBlock: latestBlockNo,
      });
    }

    if (getPastEvents.length) {
      console.log("Burning ticket ===>");

      getPastEvents.forEach(async (ticket) => {
        const ticketExist = await TicketModel.findOne({
          chainId: chainId,
          tokenId: ticket.returnValues.ticketId,
        });

        if (ticketExist) {
          ticketExist.burned = true;
          await ticketExist.save();
          console.log("Burned ticket ===> " + ticketExist._id);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = cronTasks;
