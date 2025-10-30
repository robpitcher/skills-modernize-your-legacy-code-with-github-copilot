#!/usr/bin/env node

/**
 * Account Management System
 * Modernized from COBOL legacy application
 * 
 * This application preserves the original business logic from three COBOL programs:
 * - main.cob: Menu-driven user interface and program flow
 * - operations.cob: Business logic for account operations
 * - data.cob: Data persistence layer for account balance
 */

const readline = require('readline');

// =========================================
// Data Layer (from data.cob - DataProgram)
// =========================================
class DataProgram {
    constructor() {
        // STORAGE-BALANCE PIC 9(6)V99 VALUE 1000.00
        this.storageBalance = 1000.00;
    }

    /**
     * READ operation - Returns current account balance
     * Equivalent to COBOL: IF OPERATION-TYPE = 'READ'
     */
    read() {
        return this.storageBalance;
    }

    /**
     * WRITE operation - Updates stored balance
     * Equivalent to COBOL: IF OPERATION-TYPE = 'WRITE'
     */
    write(balance) {
        this.storageBalance = balance;
    }
}

// =========================================
// Business Logic Layer (from operations.cob - Operations)
// =========================================
class Operations {
    constructor(dataProgram, rl) {
        this.dataProgram = dataProgram;
        this.rl = rl;
    }

    /**
     * View current balance (TOTAL operation)
     * Equivalent to COBOL: IF OPERATION-TYPE = 'TOTAL '
     */
    viewBalance() {
        const balance = this.dataProgram.read();
        console.log(`Current balance: ${balance.toFixed(2)}`);
    }

    /**
     * Credit account operation
     * Equivalent to COBOL: IF OPERATION-TYPE = 'CREDIT'
     */
    credit() {
        return new Promise((resolve) => {
            this.rl.question('Enter credit amount: ', (input) => {
                const amount = parseFloat(input);
                
                if (isNaN(amount) || amount < 0) {
                    console.log('Invalid amount. Please enter a valid positive number.');
                    resolve();
                    return;
                }

                const currentBalance = this.dataProgram.read();
                const newBalance = currentBalance + amount;
                this.dataProgram.write(newBalance);
                console.log(`Amount credited. New balance: ${newBalance.toFixed(2)}`);
                resolve();
            });
        });
    }

    /**
     * Debit account operation with overdraft protection
     * Equivalent to COBOL: IF OPERATION-TYPE = 'DEBIT '
     * Critical business rule: IF FINAL-BALANCE >= AMOUNT
     */
    debit() {
        return new Promise((resolve) => {
            this.rl.question('Enter debit amount: ', (input) => {
                const amount = parseFloat(input);
                
                if (isNaN(amount) || amount < 0) {
                    console.log('Invalid amount. Please enter a valid positive number.');
                    resolve();
                    return;
                }

                const currentBalance = this.dataProgram.read();
                
                // Critical business rule: Overdraft protection
                if (currentBalance >= amount) {
                    const newBalance = currentBalance - amount;
                    this.dataProgram.write(newBalance);
                    console.log(`Amount debited. New balance: ${newBalance.toFixed(2)}`);
                } else {
                    console.log('Insufficient funds for this debit.');
                }
                resolve();
            });
        });
    }
}

// =========================================
// Main Program (from main.cob - MainProgram)
// =========================================
class MainProgram {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.dataProgram = new DataProgram();
        this.operations = new Operations(this.dataProgram, this.rl);
        this.continueFlag = true;
    }

    /**
     * Display menu to user
     * Equivalent to COBOL DISPLAY statements in MAIN-LOGIC
     */
    displayMenu() {
        console.log('--------------------------------');
        console.log('Account Management System');
        console.log('1. View Balance');
        console.log('2. Credit Account');
        console.log('3. Debit Account');
        console.log('4. Exit');
        console.log('--------------------------------');
    }

    /**
     * Process user menu choice
     * Equivalent to COBOL EVALUATE USER-CHOICE
     */
    async processChoice(choice) {
        const userChoice = parseInt(choice);

        switch (userChoice) {
            case 1:
                // WHEN 1: CALL 'Operations' USING 'TOTAL '
                this.operations.viewBalance();
                break;
            case 2:
                // WHEN 2: CALL 'Operations' USING 'CREDIT'
                await this.operations.credit();
                break;
            case 3:
                // WHEN 3: CALL 'Operations' USING 'DEBIT '
                await this.operations.debit();
                break;
            case 4:
                // WHEN 4: MOVE 'NO' TO CONTINUE-FLAG
                this.continueFlag = false;
                break;
            default:
                // WHEN OTHER
                console.log('Invalid choice, please select 1-4.');
                break;
        }
    }

    /**
     * Main program loop
     * Equivalent to COBOL: PERFORM UNTIL CONTINUE-FLAG = 'NO'
     */
    async run() {
        while (this.continueFlag) {
            this.displayMenu();
            
            const choice = await new Promise((resolve) => {
                this.rl.question('Enter your choice (1-4): ', resolve);
            });

            await this.processChoice(choice);
        }

        console.log('Exiting the program. Goodbye!');
        this.rl.close();
    }
}

// =========================================
// Application Entry Point
// =========================================
if (require.main === module) {
    const app = new MainProgram();
    app.run().catch((error) => {
        console.error('An error occurred:', error);
        process.exit(1);
    });
}

module.exports = { MainProgram, Operations, DataProgram };
