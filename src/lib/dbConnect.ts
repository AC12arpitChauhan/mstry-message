import mongoose from "mongoose";

type connectionObject = {
    isConected ?: number
}

const connection: connectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConected){
        console.log("Alredy connected to database")
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})

        connection.isConected = db.connections[0].readyState

        console.log("DB Connected Successfully");

    } catch (error) {

        console.log("DB Conection Failed", error);
        process.exit(1);
    }
}

export default dbConnect;