import * as devSdk from "@line/lbd-sdk-js";
import * as logger from "firebase-functions/logger";

const baseUrl = process.env.BC_BASE_URL ?? "";
const apiKey = process.env.BC_API_KEY ?? "";
const apiSecret = process.env.BC_API_SECRET ?? "";
const contractId = process.env.BC_CONTRACT_ID ?? "";
const walletAddress = process.env.BC_WALLET_ADDRESS ?? "";
const walletSecret = process.env.BC_WALLET_SECRET ?? "";

const httpClient = new devSdk.HttpClient(baseUrl, apiKey, apiSecret);

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
    logger.error(error);
    return "error";
  }
};
