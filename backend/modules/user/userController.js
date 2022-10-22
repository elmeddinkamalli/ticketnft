const redisClient = require("../../config/redis");
const UserModel = require("./userModel");
const Utils = require("../../helper/utils");
const crypto = require("crypto");
const Web3 = require("web3");
const jwtUtil = require("../../helper/jwtUtils");

const UserCtr = {};

// login initally
UserCtr.login = async (req, res) => {
  try {
    const { nonce, signature } = req.body;
    const web3 = new Web3(
      new Web3.providers.HttpProvider("https://bsc-dataseed.binance.org/")
    );

    const signer = await web3.eth.accounts.recover(nonce, signature);

    if (signer) {
      const fetchRedisData = await redisClient.get(nonce);

      if (fetchRedisData) {
        const parsedRedisData = JSON.parse(fetchRedisData);

        const checkAddressMatched =
          parsedRedisData.walletAddress.toLowerCase() === signer.toLowerCase();

        if (checkAddressMatched) {
          const checkAddressAvalaible = await UserModel.findOne({
            walletAddress: signer.toLowerCase().trim(),
          });

          if (checkAddressAvalaible) {
            // create the token and sent i tin response
            const token = jwtUtil.getAuthToken({
              _id: checkAddressAvalaible._id,
              walletAddress: checkAddressAvalaible.walletAddress,
            });

            return res.status(200).json({
              message: req.t("SUCCESS"),
              status: true,
              data: {
                token,
                details: checkAddressAvalaible,
              },
            });
          } else {
            const createUser = new UserModel({
              walletAddress: parsedRedisData.walletAddress.toLowerCase(),
            });

            const saveUser = await createUser.save();

            const token = jwtUtil.getAuthToken({
              _id: saveUser._id,
              walletAddress: saveUser.walletAddress,
            });

            return res.status(200).json({
              message: req.t("SUCCESS"),
              status: true,
              data: {
                token,
                details: {
                  name: saveUser.name,
                  surname: saveUser.surname,
                  status: saveUser.status,
                  profile: saveUser.profile,
                  portfolio: saveUser.portfolio,
                },
              },
            });
          }
        } else {
          // invalid address
          return res.status(400).json({
            message: req.t("INVALID_CALL"),
            status: false,
          });
        }
      } else {
        // redis data not avalible login again
        return res.status(400).json({
          message: req.t("LOGIN_AGAIN"),
          status: false,
        });
      }
    } else {
      // inavlid signature
      return res.status(400).json({
        message: req.t("INVALID_SIGNATURE"),
        status: false,
      });
    }
  } catch (err) {
    console.log("err in signup :", err);
    Utils.echoLog("error in singnup  ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

// get user details
UserCtr.getUserDetails = async (req, res) => {
  try {
    const query = {};
    query._id = req.userData._id;

    if (Object.keys(query).length) {
      const fetchUserData = await UserModel.findOne(query);

      return res.status(200).json({
        message: req.t("SUCCESS"),
        status: true,
        data: fetchUserData,
      });
    } else {
      return res.status(400).json({
        message: req.t("INVALID_DETAILS"),
        status: false,
      });
    }
  } catch (err) {
    Utils.echoLog("error in listing user   ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: true,
      err: err.message ? err.message : err,
    });
  }
};

// genrate a nonce
UserCtr.genrateNonce = async (req, res) => {
  try {
    let nonce = crypto.randomBytes(16).toString("hex");
    const data = {
      walletAddress: req.params.address,
      nonce: nonce,
    };

    await redisClient.set(nonce, JSON.stringify(data), "EX", 60 * 10);

    return res.status(200).json({
      message: req.t("NONCE_GENRATED"),
      status: true,
      data: {
        nonce: nonce,
      },
    });
  } catch (err) {
    Utils.echoLog("error in genrating nonce  ", err);
    return res.status(500).json({
      message: req.t("DB_ERROR"),
      status: false,
      err: err.message ? err.message : err,
    });
  }
};

// get user details
// UserCtr.getSingleUserDetails = async (req, res) => {
//   try {
//     const getUserDetails = JSON.parse(
//       JSON.stringify(
//         await UserModel.findOne(
//           { _id: req.params.userId },
//           { stage: 0, transactionId: 0, status: 0 }
//         )
//           .populate({
//             path: "category",
//             select: { _id: 1, categoryName: 1, image: 1 },
//           })
//           .populate({
//             path: "role",
//             select: { _id: 1, roleName: 1 },
//           })
//       )
//     );

//     if (req.userData && req.userData._id) {
//       const checkIsFollowed = await FollowModel.findOne({
//         userId: req.params.userId,
//         follow: req.userData._id,
//       });

//       if (checkIsFollowed) {
//         getUserDetails.isFollowed = true;
//       } else {
//         getUserDetails.isFollowed = false;
//       }
//     } else {
//       getUserDetails.isFollowed = false;
//     }

//     return res.status(200).json({
//       message: "SINGLE_USER_DETAILS",
//       status: true,
//       data: getUserDetails,
//     });
//   } catch (err) {
//     Utils.echoLog("Erro in getUserDetails creator");
//     return res.status(500).json({
//       message: req.t("DB_ERROR"),
//       status: true,
//       err: err.message ? err.message : err,
//     });
//   }
// };

// genrate access token
// UserCtr.genrateAccessTokenForTwitter = async (req, res) => {
//   try {
//     consumer().getOAuthRequestToken(
//       async (error, oauthToken, oauthTokenSecret, results) => {
//         if (error) {
//           return res.status(400).json({
//             message: req.t("DB_ERROR"),
//             status: false,
//             err: error.message ? error.message : error,
//           });
//         } else {
//           redisClient.del(`twitter-${req.userData._id}`);

//           const authToken = {
//             token: oauthToken,
//             secret: oauthTokenSecret,
//           };

//           await redisClient.set(
//             `twitter-${req.userData._id}`,
//             JSON.stringify(authToken),
//             "EX",
//             60 * 100
//           );

//           return res.status(200).json({
//             message: req.t("TWITTER_CODE"),
//             status: true,
//             data: {
//               code: oauthToken,
//               redirect_uri: `http://twitter.com/oauth/authorize?oauth_token=${oauthToken}`,
//             },
//           });
//         }
//       }
//     );
//   } catch (err) {
//     Utils.echoLog("error in creating user ", err);
//     return res.status(500).json({
//       message: req.t("DB_ERROR"),
//       status: false,
//       err: err.message ? err.message : err,
//     });
//   }
// };

module.exports = UserCtr;
