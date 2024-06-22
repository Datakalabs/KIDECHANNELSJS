import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import backendConfig from "../amplifyconfiguration.json";

Amplify.configure(backendConfig);
export const client = generateClient();
