const { faker } = require('@faker-js/faker');  // Importing the updated Faker package
const fs = require('fs');
const transactions = require('./transactions');
const dotenv = require("dotenv").config();

// Example Institutions, Budgets, and Users (replace with actual data)
// const institutions = [
//     "605c72ef153207001fcdad20", "605c72ef153207001fcdad21", "605c72ef153207001fcdad22", 
//     "605c72ef153207001fcdad23", "605c72ef153207001fcdad24", "605c72ef153207001fcdad25"
// ];

// const budgets = [
//     "605c72ef153207001fcdad26", "605c72ef153207001fcdad27", "605c72ef153207001fcdad28", 
//     "605c72ef153207001fcdad29", "605c72ef153207001fcdad2A", "605c72ef153207001fcdad2B"
// ];

// const users = [
//     "605c72ef153207001fcdad2C", "605c72ef153207001fcdad2D", "605c72ef153207001fcdad2E", 
//     "605c72ef153207001fcdad2F", "605c72ef153207001fcdad30", "605c72ef153207001fcdad31"
// ];

// // Generate random transactions
// const generateTransactions = (num, fiscalYear) => {
//     let transactions = [];
//     for (let i = 0; i < num; i++) {
//         const transaction = {
//             type: faker.helpers.arrayElement(['Income', 'Expense', 'Transfer']),
//             transactionDescription: faker.lorem.sentence(),
//             amount: faker.commerce.price(100, 10000, 2),
//             institution: faker.helpers.arrayElement(institutions),
//             budget: faker.helpers.arrayElement(budgets),
//             Slips: faker.string.alphanumeric(8),
//             recordedBy: faker.helpers.arrayElement(users),
//             fiscalYear: fiscalYear,
//             createdAt: faker.date.past(1),
//             updatedAt: faker.date.past(0.5)
//         };
//         transactions.push(transaction);
//     }
//     return transactions;
// };

// // Generate data for FY 2023-2024 and FY 2024-2025
// const transactionsFY2023_2024 = generateTransactions(500, 'FY 2023-2024');
// const transactionsFY2024_2025 = generateTransactions(500, 'FY 2024-2025');

// // Combine all transactions
// const allTransactions = [...transactionsFY2023_2024, ...transactionsFY2024_2025];

// // Write to a JSON file
// fs.writeFileSync('transactions.json', JSON.stringify(allTransactions, null, 2), 'utf8');
// console.log('Generated 1000 transactions and saved to transactions.json');

const Transaction =require("../models/transactions");
const dbConnect = require("../config/database");
const { default: mongoose } = require("mongoose");
const addTransactions=async(req,res)=>{
    try {
        const newTransactions=await Transaction.insertMany(transactions);
        console.log("success")
    } catch (error) {
        throw new Error(error);
    }
}

dbConnect().then(() => {
    console.log("Database connected!");
    addTransactions().then(()=>{
        mongoose.connection.close();
    });
})
