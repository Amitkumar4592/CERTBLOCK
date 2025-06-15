# Blockchain Certificate Verification Backend

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file with the following variables:
   - `PORT=5000`
   - `MONGO_URI=your_mongodb_connection_string`
   - `JWT_SECRET=your_secret_key`
   - `CONTRACT_ADDRESS=your_contract_address`
   - `PRIVATE_KEY=your_hardhat_account_private_key`
   - `BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545`

3. Start the server:
   ```sh
   npm run dev
   ```

## Structure
- `server.js` - Entry point
- `db.js` - MongoDB connection
- `userModel.js` - User schema
- `auth.js` - Auth routes (signup/login)

## Notes
- Make sure Hardhat node is running before starting the backend.
