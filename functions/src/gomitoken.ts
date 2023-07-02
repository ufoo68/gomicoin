import * as devSdk from "@line/lbd-sdk-js";
import * as logger from "firebase-functions/logger";

const baseUrl = process.env.BC_BASE_URL ?? "";
const apiKey = process.env.BC_API_KEY ?? "";
const apiSecret = process.env.BC_API_SECRET ?? "";
const contractId = process.env.BC_CONTRACT_ID ?? "";
const walletAddress = process.env.BC_WALLET_ADDRESS ?? "";
const walletSecret = process.env.BC_WALLET_SECRET ?? "";

const httpClient = new devSdk.HttpClient(baseUrl, apiKey, apiSecret);

type GomiToken = {
  symbol: string;
  imgUri: string;
  amount: number;
};

export const requestGomiToken = async (
  targetAddress: string,
  amount: number
): Promise<string> => {
  try {
    const request = new devSdk.MintServiceTokenRequest(
      walletAddress,
      walletSecret,
      String(amount),
      targetAddress
    );
    const response = await httpClient.mintServiceToken(contractId, request);
    logger.info(response);
    return response.responseData?.txHash ?? "";
  } catch (error) {
    logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return "error";
  }
};

export const getGomiToken = async (
  userId: string
): Promise<GomiToken> => {
  try {
    const response = await httpClient.serviceTokenBalanceOfUser(
      userId,
      contractId
    );
    logger.info(response);
    const amount = Number(response.responseData?.amount) || 0;
    const decimails = response.responseData?.decimals ?? 0;
    const symbol = response.responseData?.symbol ?? "";
    const imgUri = response.responseData?.imgUri ?? "";
    return { amount: amount / 10 ** decimails, symbol, imgUri };
  } catch (error) {
    logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return { amount: 0, symbol: "", imgUri: "" };
  }
};
