import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface ServerFileDocument extends Document {
  code: string;
  path: string;
  sharpPath: string | undefined;
  fileName: string;
  fileSize: string;
  createTime: string;
  uploader: mongoose.Types.ObjectId;
}

const ServerFileSchema: Schema = new Schema({
  code: {
    type: String,
    unique: true,
    default: () => uuidv4().toUpperCase(),
  },
  path: { type: String, default: "--" },
  sharpPath: { type: String || undefined, default: undefined },
  fileName: { type: String, default: "--" },
  fileSize: { type: String, default: "--" },
  createTime: { type: String, default: "--" },
  uploader: { type: mongoose.Types.ObjectId, ref: "User" },
});

const ServerFile = mongoose.model<ServerFileDocument>(
  "ServerFile",
  ServerFileSchema
);
export { ServerFileSchema, ServerFile, ServerFileDocument };
