/**
 * Unit Tests for Account Management System
 * Based on Test Plan: docs/TESTPLAN.md
 * 
 * These tests validate the business logic migrated from COBOL to Node.js
 * ensuring all functionality matches the original COBOL application behavior.
 */

const { DataProgram, Operations, MainProgram } = require('./index');

// Mock readline interface for testing
const createMockReadline = () => {
    return {
        question: jest.fn(),
        close: jest.fn()
    };
};

describe('Account Management System - Test Suite', () => {

    // =========================================
    // 1. System Initialization Tests
    // =========================================
    describe('1. System Initialization and Menu Display', () => {
        
        test('TC-001: Verify system starts with initial balance', () => {
            const dataProgram = new DataProgram();
            expect(dataProgram.read()).toBe(1000.00);
        });

        test('TC-002: Verify main menu displays correctly', () => {
            const consoleSpy = jest.spyOn(console, 'log');
            const app = new MainProgram();
            app.displayMenu();
            
            expect(consoleSpy).toHaveBeenCalledWith('Account Management System');
            expect(consoleSpy).toHaveBeenCalledWith('1. View Balance');
            expect(consoleSpy).toHaveBeenCalledWith('2. Credit Account');
            expect(consoleSpy).toHaveBeenCalledWith('3. Debit Account');
            expect(consoleSpy).toHaveBeenCalledWith('4. Exit');
            
            consoleSpy.mockRestore();
        });

        test('TC-003: Verify menu persists until exit', async () => {
            const app = new MainProgram();
            
            // Simulate selecting option 1 (View Balance) then option 4 (Exit)
            let callCount = 0;
            app.rl.question = jest.fn((question, callback) => {
                if (callCount === 0) {
                    callCount++;
                    callback('1'); // First choice: View Balance
                } else {
                    callback('4'); // Second choice: Exit
                }
            });

            await app.run();
            
            expect(app.continueFlag).toBe(false);
        });
    });

    // =========================================
    // 2. View Balance Functionality Tests
    // =========================================
    describe('2. View Balance Functionality', () => {
        
        test('TC-004: View initial balance', () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            operations.viewBalance();
            
            expect(consoleSpy).toHaveBeenCalledWith('Current balance: 1000.00');
            consoleSpy.mockRestore();
        });

        test('TC-005: View balance after credit operation', () => {
            const dataProgram = new DataProgram();
            dataProgram.write(1500.00);
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            operations.viewBalance();
            
            expect(consoleSpy).toHaveBeenCalledWith('Current balance: 1500.00');
            consoleSpy.mockRestore();
        });

        test('TC-006: View balance after debit operation', () => {
            const dataProgram = new DataProgram();
            dataProgram.write(800.00);
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            const consoleSpy = jest.spyOn(console, 'log');
            operations.viewBalance();
            
            expect(consoleSpy).toHaveBeenCalledWith('Current balance: 800.00');
            consoleSpy.mockRestore();
        });

        test('TC-007: View balance after multiple operations', () => {
            const dataProgram = new DataProgram();
            // Start: 1000.00, Credit 300.00, Debit 150.00, Credit 100.00 = 1250.00
            const currentBalance = dataProgram.read();
            let newBalance = currentBalance + 300.00;
            dataProgram.write(newBalance);
            newBalance = dataProgram.read() - 150.00;
            dataProgram.write(newBalance);
            newBalance = dataProgram.read() + 100.00;
            dataProgram.write(newBalance);
            
            expect(dataProgram.read()).toBe(1250.00);
        });
    });

    // =========================================
    // 3. Credit Account Functionality Tests
    // =========================================
    describe('3. Credit Account Functionality', () => {
        
        test('TC-008: Credit account with valid positive amount', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('500.00');
            });

            const consoleSpy = jest.spyOn(console, 'log');
            await operations.credit();
            
            expect(dataProgram.read()).toBe(1500.00);
            expect(consoleSpy).toHaveBeenCalledWith('Amount credited. New balance: 1500.00');
            consoleSpy.mockRestore();
        });

        test('TC-009: Credit account with small amount', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('0.01');
            });

            await operations.credit();
            
            expect(dataProgram.read()).toBe(1000.01);
        });

        test('TC-010: Credit account with large amount', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('999999.99');
            });

            await operations.credit();
            
            expect(dataProgram.read()).toBe(1000999.99);
        });

        test('TC-011: Credit account with zero amount', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('0.00');
            });

            await operations.credit();
            
            expect(dataProgram.read()).toBe(1000.00);
        });

        test('TC-012: Credit account multiple times', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Credit 100.00
            mockRl.question.mockImplementation((question, callback) => {
                callback('100.00');
            });
            await operations.credit();
            
            // Credit 200.00
            mockRl.question.mockImplementation((question, callback) => {
                callback('200.00');
            });
            await operations.credit();
            
            // Credit 300.00
            mockRl.question.mockImplementation((question, callback) => {
                callback('300.00');
            });
            await operations.credit();
            
            expect(dataProgram.read()).toBe(1600.00);
        });

        test('TC-013: Verify balance persists after credit', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('500.00');
            });
            await operations.credit();
            
            const balance = dataProgram.read();
            expect(balance).toBe(1500.00);
            
            // Verify persistence
            operations.viewBalance();
            expect(dataProgram.read()).toBe(1500.00);
        });
    });

    // =========================================
    // 4. Debit Account Functionality Tests
    // =========================================
    describe('4. Debit Account Functionality', () => {
        
        test('TC-014: Debit account with valid amount (sufficient funds)', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('300.00');
            });

            const consoleSpy = jest.spyOn(console, 'log');
            await operations.debit();
            
            expect(dataProgram.read()).toBe(700.00);
            expect(consoleSpy).toHaveBeenCalledWith('Amount debited. New balance: 700.00');
            consoleSpy.mockRestore();
        });

        test('TC-015: Debit account with amount equal to balance', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('1000.00');
            });

            await operations.debit();
            
            expect(dataProgram.read()).toBe(0.00);
        });

        test('TC-016: Debit account with insufficient funds (CRITICAL)', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('1500.00');
            });

            const consoleSpy = jest.spyOn(console, 'log');
            await operations.debit();
            
            expect(dataProgram.read()).toBe(1000.00);
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            consoleSpy.mockRestore();
        });

        test('TC-017: Debit account with amount slightly over balance', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('1000.01');
            });

            const consoleSpy = jest.spyOn(console, 'log');
            await operations.debit();
            
            expect(dataProgram.read()).toBe(1000.00);
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            consoleSpy.mockRestore();
        });

        test('TC-018: Debit account with small amount', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('0.01');
            });

            await operations.debit();
            
            expect(dataProgram.read()).toBe(999.99);
        });

        test('TC-019: Debit account with zero amount', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('0.00');
            });

            await operations.debit();
            
            expect(dataProgram.read()).toBe(1000.00);
        });

        test('TC-020: Debit from zero balance', async () => {
            const dataProgram = new DataProgram();
            dataProgram.write(0.00);
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('100.00');
            });

            const consoleSpy = jest.spyOn(console, 'log');
            await operations.debit();
            
            expect(dataProgram.read()).toBe(0.00);
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            consoleSpy.mockRestore();
        });

        test('TC-021: Multiple consecutive debits', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Debit 100.00
            mockRl.question.mockImplementation((question, callback) => {
                callback('100.00');
            });
            await operations.debit();
            
            // Debit 200.00
            mockRl.question.mockImplementation((question, callback) => {
                callback('200.00');
            });
            await operations.debit();
            
            // Debit 300.00
            mockRl.question.mockImplementation((question, callback) => {
                callback('300.00');
            });
            await operations.debit();
            
            expect(dataProgram.read()).toBe(400.00);
        });

        test('TC-022: Verify balance persists after debit', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('300.00');
            });
            await operations.debit();
            
            const balance = dataProgram.read();
            expect(balance).toBe(700.00);
            
            // Verify persistence
            operations.viewBalance();
            expect(dataProgram.read()).toBe(700.00);
        });
    });

    // =========================================
    // 5. Data Persistence Tests
    // =========================================
    describe('5. Data Persistence', () => {
        
        test('TC-023: Balance persists across operations', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // View initial balance (1000.00)
            expect(dataProgram.read()).toBe(1000.00);
            
            // Credit 500.00 (balance: 1500.00)
            mockRl.question.mockImplementation((question, callback) => {
                callback('500.00');
            });
            await operations.credit();
            expect(dataProgram.read()).toBe(1500.00);
            
            // Debit 200.00 (balance: 1300.00)
            mockRl.question.mockImplementation((question, callback) => {
                callback('200.00');
            });
            await operations.debit();
            expect(dataProgram.read()).toBe(1300.00);
            
            // View balance to verify
            operations.viewBalance();
            expect(dataProgram.read()).toBe(1300.00);
        });

        test('TC-024: READ operation returns current balance', () => {
            const dataProgram = new DataProgram();
            dataProgram.write(1234.56);
            
            expect(dataProgram.read()).toBe(1234.56);
        });

        test('TC-025: WRITE operation updates stored balance', () => {
            const dataProgram = new DataProgram();
            
            dataProgram.write(5678.90);
            const balance = dataProgram.read();
            
            expect(balance).toBe(5678.90);
        });
    });

    // =========================================
    // 6. Input Validation and Error Handling Tests
    // =========================================
    describe('6. Input Validation and Error Handling', () => {
        
        test('TC-026: Invalid menu choice - zero', async () => {
            const app = new MainProgram();
            const consoleSpy = jest.spyOn(console, 'log');
            
            await app.processChoice('0');
            
            expect(consoleSpy).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
            consoleSpy.mockRestore();
        });

        test('TC-027: Invalid menu choice - above range', async () => {
            const app = new MainProgram();
            const consoleSpy = jest.spyOn(console, 'log');
            
            await app.processChoice('5');
            
            expect(consoleSpy).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
            consoleSpy.mockRestore();
        });

        test('TC-028: Invalid menu choice - above range (large number)', async () => {
            const app = new MainProgram();
            const consoleSpy = jest.spyOn(console, 'log');
            
            await app.processChoice('9');
            
            expect(consoleSpy).toHaveBeenCalledWith('Invalid choice, please select 1-4.');
            consoleSpy.mockRestore();
        });

        test('TC-029: Valid menu choice - boundary (1)', async () => {
            const app = new MainProgram();
            const consoleSpy = jest.spyOn(console, 'log');
            
            await app.processChoice('1');
            
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Current balance:'));
            consoleSpy.mockRestore();
        });

        test('TC-030: Valid menu choice - boundary (4)', async () => {
            const app = new MainProgram();
            
            await app.processChoice('4');
            
            expect(app.continueFlag).toBe(false);
        });
    });

    // =========================================
    // 7. Transaction Sequences Tests
    // =========================================
    describe('7. Transaction Sequences', () => {
        
        test('TC-031: Credit then debit sequence', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Credit 500.00 (balance: 1500.00)
            mockRl.question.mockImplementation((question, callback) => {
                callback('500.00');
            });
            await operations.credit();
            
            // Debit 300.00 (balance: 1200.00)
            mockRl.question.mockImplementation((question, callback) => {
                callback('300.00');
            });
            await operations.debit();
            
            expect(dataProgram.read()).toBe(1200.00);
        });

        test('TC-032: Debit then credit sequence', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Debit 400.00 (balance: 600.00)
            mockRl.question.mockImplementation((question, callback) => {
                callback('400.00');
            });
            await operations.debit();
            
            // Credit 800.00 (balance: 1400.00)
            mockRl.question.mockImplementation((question, callback) => {
                callback('800.00');
            });
            await operations.credit();
            
            expect(dataProgram.read()).toBe(1400.00);
        });

        test('TC-033: Multiple operations with balance check', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Credit 200.00 (balance: 1200.00)
            mockRl.question.mockImplementation((question, callback) => {
                callback('200.00');
            });
            await operations.credit();
            expect(dataProgram.read()).toBe(1200.00);
            
            // Debit 150.00 (balance: 1050.00)
            mockRl.question.mockImplementation((question, callback) => {
                callback('150.00');
            });
            await operations.debit();
            expect(dataProgram.read()).toBe(1050.00);
            
            // Credit 50.00 (balance: 1100.00)
            mockRl.question.mockImplementation((question, callback) => {
                callback('50.00');
            });
            await operations.credit();
            expect(dataProgram.read()).toBe(1100.00);
        });

        test('TC-034: Failed debit followed by successful credit', async () => {
            const dataProgram = new DataProgram();
            dataProgram.write(500.00);
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Try to debit 1000.00 (rejected)
            mockRl.question.mockImplementation((question, callback) => {
                callback('1000.00');
            });
            const consoleSpy = jest.spyOn(console, 'log');
            await operations.debit();
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            expect(dataProgram.read()).toBe(500.00);
            
            // Credit 600.00 (balance: 1100.00)
            mockRl.question.mockImplementation((question, callback) => {
                callback('600.00');
            });
            await operations.credit();
            expect(dataProgram.read()).toBe(1100.00);
            
            consoleSpy.mockRestore();
        });

        test('TC-035: Successful debit followed by failed debit', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Debit 700.00 (balance: 300.00)
            mockRl.question.mockImplementation((question, callback) => {
                callback('700.00');
            });
            await operations.debit();
            expect(dataProgram.read()).toBe(300.00);
            
            // Try to debit 500.00 (rejected)
            mockRl.question.mockImplementation((question, callback) => {
                callback('500.00');
            });
            const consoleSpy = jest.spyOn(console, 'log');
            await operations.debit();
            expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
            expect(dataProgram.read()).toBe(300.00);
            
            consoleSpy.mockRestore();
        });
    });

    // =========================================
    // 8. Exit and Program Termination Tests
    // =========================================
    describe('8. Exit and Program Termination', () => {
        
        test('TC-036: Exit application immediately', async () => {
            const app = new MainProgram();
            
            app.rl.question = jest.fn((question, callback) => {
                callback('4'); // Exit immediately
            });

            const consoleSpy = jest.spyOn(console, 'log');
            await app.run();
            
            expect(app.continueFlag).toBe(false);
            expect(consoleSpy).toHaveBeenCalledWith('Exiting the program. Goodbye!');
            consoleSpy.mockRestore();
        });

        test('TC-037: Exit application after operations', async () => {
            const app = new MainProgram();
            
            let callCount = 0;
            app.rl.question = jest.fn((question, callback) => {
                if (callCount === 0) {
                    callCount++;
                    callback('1'); // View balance first
                } else {
                    callback('4'); // Then exit
                }
            });

            const consoleSpy = jest.spyOn(console, 'log');
            await app.run();
            
            expect(app.continueFlag).toBe(false);
            expect(consoleSpy).toHaveBeenCalledWith('Exiting the program. Goodbye!');
            consoleSpy.mockRestore();
        });
    });

    // =========================================
    // 9. Boundary and Edge Cases Tests
    // =========================================
    describe('9. Boundary and Edge Cases', () => {
        
        test('TC-038: Maximum balance value', async () => {
            const dataProgram = new DataProgram();
            dataProgram.write(999999.98);
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('0.01');
            });
            await operations.credit();
            
            expect(dataProgram.read()).toBe(999999.99);
        });

        test('TC-039: Debit reducing balance to exactly zero', async () => {
            const dataProgram = new DataProgram();
            dataProgram.write(500.00);
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('500.00');
            });
            
            const consoleSpy = jest.spyOn(console, 'log');
            await operations.debit();
            
            expect(dataProgram.read()).toBe(0.00);
            expect(consoleSpy).toHaveBeenCalledWith('Amount debited. New balance: 0.00');
            consoleSpy.mockRestore();
        });

        test('TC-040: Operations on zero balance', async () => {
            const dataProgram = new DataProgram();
            dataProgram.write(0.00);
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // View balance (0.00)
            expect(dataProgram.read()).toBe(0.00);
            
            // Credit 100.00 (balance: 100.00)
            mockRl.question.mockImplementation((question, callback) => {
                callback('100.00');
            });
            await operations.credit();
            expect(dataProgram.read()).toBe(100.00);
            
            // Debit 50.00 (balance: 50.00)
            mockRl.question.mockImplementation((question, callback) => {
                callback('50.00');
            });
            await operations.debit();
            expect(dataProgram.read()).toBe(50.00);
        });

        test('TC-041: Decimal precision - two decimal places', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            // Credit 123.45 (balance: 1123.45)
            mockRl.question.mockImplementation((question, callback) => {
                callback('123.45');
            });
            await operations.credit();
            
            // Debit 67.89 (balance: 1055.56)
            mockRl.question.mockImplementation((question, callback) => {
                callback('67.89');
            });
            await operations.debit();
            
            expect(dataProgram.read()).toBeCloseTo(1055.56, 2);
        });
    });

    // =========================================
    // Additional Edge Cases for Input Validation
    // =========================================
    describe('Additional Input Validation Tests', () => {
        
        test('Invalid credit amount - negative number', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('-100.00');
            });

            const consoleSpy = jest.spyOn(console, 'log');
            await operations.credit();
            
            expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Invalid amount. Please enter a valid positive number.');
            consoleSpy.mockRestore();
        });

        test('Invalid debit amount - negative number', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('-100.00');
            });

            const consoleSpy = jest.spyOn(console, 'log');
            await operations.debit();
            
            expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Invalid amount. Please enter a valid positive number.');
            consoleSpy.mockRestore();
        });

        test('Invalid credit amount - non-numeric input', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('abc');
            });

            const consoleSpy = jest.spyOn(console, 'log');
            await operations.credit();
            
            expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Invalid amount. Please enter a valid positive number.');
            consoleSpy.mockRestore();
        });

        test('Invalid debit amount - non-numeric input', async () => {
            const dataProgram = new DataProgram();
            const mockRl = createMockReadline();
            const operations = new Operations(dataProgram, mockRl);
            
            mockRl.question.mockImplementation((question, callback) => {
                callback('xyz');
            });

            const consoleSpy = jest.spyOn(console, 'log');
            await operations.debit();
            
            expect(dataProgram.read()).toBe(1000.00); // Balance unchanged
            expect(consoleSpy).toHaveBeenCalledWith('Invalid amount. Please enter a valid positive number.');
            consoleSpy.mockRestore();
        });
    });
});
