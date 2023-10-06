import mongo from "mongodb";

const MongoClient = mongo.MongoClient;
const url =
  "mongodb+srv://annuragggg:AMBRtVs6ZDxRsXsD@cluster0.aohwvqc.mongodb.net/";

const client = new MongoClient(url);

try {
  client.connect();
} catch (error) {
  console.log(error);
}

export const med = client.db("Medi360");
export const userCol = med.collection("users");
export const apppointmentCol = med.collection("appointments");



