# Test Plan - Account Management System

## Overview
This test plan covers all business logic and functionality of the Account Management System COBOL application. This plan will be used to validate business requirements with stakeholders and later to create unit and integration tests for the Node.js migration.

## Application Components
- **MainProgram**: User interface and menu system
- **Operations**: Business logic for account operations (view balance, credit, debit)
- **DataProgram**: Data persistence layer for account balance storage

---

## Test Cases

### 1. System Initialization and Menu Display

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-001 | Verify system starts with initial balance | System not running | 1. Start the application | System initializes with default balance of 1000.00 | | | Initial balance is hardcoded in DataProgram |
| TC-002 | Verify main menu displays correctly | System running | 1. Start application<br>2. Observe main menu | Menu displays with options:<br>1. View Balance<br>2. Credit Account<br>3. Debit Account<br>4. Exit | | | Menu should be user-friendly |
| TC-003 | Verify menu persists until exit | System running | 1. Start application<br>2. Perform any operation<br>3. Observe menu redisplays | Menu redisplays after each operation until exit is selected | | | Ensures continuous operation |

---

### 2. View Balance Functionality

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-004 | View initial balance | System started with default balance | 1. Start application<br>2. Select option 1 (View Balance) | Display shows "Current balance: 1000.00" | | | Default balance verification |
| TC-005 | View balance after credit operation | Balance modified by credit | 1. Start application<br>2. Credit 500.00<br>3. Select option 1 (View Balance) | Display shows "Current balance: 1500.00" | | | Balance reflects credit operation |
| TC-006 | View balance after debit operation | Balance modified by debit | 1. Start application<br>2. Debit 200.00<br>3. Select option 1 (View Balance) | Display shows "Current balance: 800.00" | | | Balance reflects debit operation |
| TC-007 | View balance after multiple operations | Multiple credits and debits performed | 1. Start application<br>2. Credit 300.00<br>3. Debit 150.00<br>4. Credit 100.00<br>5. Select option 1 (View Balance) | Display shows "Current balance: 1250.00" | | | Balance accuracy after multiple operations |

---

### 3. Credit Account Functionality

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-008 | Credit account with valid positive amount | Current balance: 1000.00 | 1. Select option 2 (Credit Account)<br>2. Enter amount: 500.00 | 1. System prompts for amount<br>2. Balance increases by 500.00<br>3. Display shows "Amount credited. New balance: 1500.00" | | | Standard credit operation |
| TC-009 | Credit account with small amount | Current balance: 1000.00 | 1. Select option 2 (Credit Account)<br>2. Enter amount: 0.01 | 1. Balance increases by 0.01<br>2. Display shows "Amount credited. New balance: 1000.01" | | | Test minimum decimal precision |
| TC-010 | Credit account with large amount | Current balance: 1000.00 | 1. Select option 2 (Credit Account)<br>2. Enter amount: 999999.99 | 1. Balance increases by 999999.99<br>2. Display shows "Amount credited. New balance: 1000999.99" | | | Test maximum allowed amount (6 digits + 2 decimals) |
| TC-011 | Credit account with zero amount | Current balance: 1000.00 | 1. Select option 2 (Credit Account)<br>2. Enter amount: 0.00 | 1. Balance remains 1000.00<br>2. Display shows "Amount credited. New balance: 1000.00" | | | Edge case: zero credit |
| TC-012 | Credit account multiple times | Current balance: 1000.00 | 1. Credit 100.00<br>2. Credit 200.00<br>3. Credit 300.00 | Final balance: 1600.00 | | | Multiple consecutive credits |
| TC-013 | Verify balance persists after credit | Balance credited in previous session | 1. Credit 500.00<br>2. View balance to confirm 1500.00<br>3. Perform another operation | Balance shows 1500.00 and persists | | | Data persistence verification |

---

### 4. Debit Account Functionality

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-014 | Debit account with valid amount (sufficient funds) | Current balance: 1000.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 300.00 | 1. System prompts for amount<br>2. Balance decreases by 300.00<br>3. Display shows "Amount debited. New balance: 700.00" | | | Standard debit operation |
| TC-015 | Debit account with amount equal to balance | Current balance: 1000.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 1000.00 | 1. Balance becomes 0.00<br>2. Display shows "Amount debited. New balance: 0.00" | | | Debit entire balance |
| TC-016 | Debit account with insufficient funds | Current balance: 1000.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 1500.00 | 1. Transaction rejected<br>2. Display shows "Insufficient funds for this debit."<br>3. Balance remains 1000.00 | | | **Critical**: Overdraft protection |
| TC-017 | Debit account with amount slightly over balance | Current balance: 1000.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 1000.01 | 1. Transaction rejected<br>2. Display shows "Insufficient funds for this debit."<br>3. Balance remains 1000.00 | | | Edge case: overdraft by 1 cent |
| TC-018 | Debit account with small amount | Current balance: 1000.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 0.01 | 1. Balance decreases by 0.01<br>2. Display shows "Amount debited. New balance: 999.99" | | | Test minimum decimal precision |
| TC-019 | Debit account with zero amount | Current balance: 1000.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 0.00 | 1. Balance remains 1000.00<br>2. Display shows "Amount debited. New balance: 1000.00" | | | Edge case: zero debit |
| TC-020 | Debit from zero balance | Current balance: 0.00 | 1. Select option 3 (Debit Account)<br>2. Enter amount: 100.00 | 1. Transaction rejected<br>2. Display shows "Insufficient funds for this debit."<br>3. Balance remains 0.00 | | | Cannot debit from empty account |
| TC-021 | Multiple consecutive debits | Current balance: 1000.00 | 1. Debit 100.00<br>2. Debit 200.00<br>3. Debit 300.00 | Final balance: 400.00 | | | Multiple debit operations |
| TC-022 | Verify balance persists after debit | Balance debited in previous session | 1. Debit 300.00<br>2. View balance to confirm 700.00<br>3. Perform another operation | Balance shows 700.00 and persists | | | Data persistence verification |

---

### 5. Data Persistence

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-023 | Balance persists across operations | System running | 1. View balance (1000.00)<br>2. Credit 500.00 (balance: 1500.00)<br>3. Debit 200.00 (balance: 1300.00)<br>4. View balance | Display shows 1300.00 | | | Balance maintained in memory during session |
| TC-024 | Read operation returns current balance | Balance is 1234.56 | 1. Set balance to 1234.56<br>2. Call DataProgram with READ operation | Returns balance of 1234.56 | | | READ operation verification |
| TC-025 | Write operation updates stored balance | Balance to be updated to 5678.90 | 1. Call DataProgram with WRITE operation and value 5678.90<br>2. Call READ operation | READ returns 5678.90 | | | WRITE operation verification |

---

### 6. Input Validation and Error Handling

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-026 | Invalid menu choice - zero | Main menu displayed | 1. Enter choice: 0 | Display shows "Invalid choice, please select 1-4."<br>Menu redisplays | | | Input validation for menu |
| TC-027 | Invalid menu choice - above range | Main menu displayed | 1. Enter choice: 5 | Display shows "Invalid choice, please select 1-4."<br>Menu redisplays | | | Input validation for menu |
| TC-028 | Invalid menu choice - above range (large number) | Main menu displayed | 1. Enter choice: 9 | Display shows "Invalid choice, please select 1-4."<br>Menu redisplays | | | Input validation for menu |
| TC-029 | Valid menu choice - boundary (1) | Main menu displayed | 1. Enter choice: 1 | View Balance operation executes | | | Lower boundary validation |
| TC-030 | Valid menu choice - boundary (4) | Main menu displayed | 1. Enter choice: 4 | System exits gracefully | | | Upper boundary validation |

---

### 7. Transaction Sequences

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-031 | Credit then debit sequence | Initial balance: 1000.00 | 1. Credit 500.00 (balance: 1500.00)<br>2. Debit 300.00 (balance: 1200.00) | Final balance: 1200.00 | | | Common transaction sequence |
| TC-032 | Debit then credit sequence | Initial balance: 1000.00 | 1. Debit 400.00 (balance: 600.00)<br>2. Credit 800.00 (balance: 1400.00) | Final balance: 1400.00 | | | Reverse transaction sequence |
| TC-033 | Multiple operations with balance check | Initial balance: 1000.00 | 1. Credit 200.00<br>2. View balance (1200.00)<br>3. Debit 150.00<br>4. View balance (1050.00)<br>5. Credit 50.00<br>6. View balance | Final balance: 1100.00 | | | Interleaved operations with validation |
| TC-034 | Failed debit followed by successful credit | Initial balance: 500.00 | 1. Debit 1000.00 (rejected)<br>2. Verify balance still 500.00<br>3. Credit 600.00 (balance: 1100.00) | 1. First debit rejected<br>2. Credit succeeds<br>3. Final balance: 1100.00 | | | Failed operation doesn't affect subsequent operations |
| TC-035 | Successful debit followed by failed debit | Initial balance: 1000.00 | 1. Debit 700.00 (balance: 300.00)<br>2. Debit 500.00 (rejected)<br>3. Verify balance still 300.00 | 1. First debit succeeds<br>2. Second debit rejected<br>3. Final balance: 300.00 | | | Partial transaction sequence |

---

### 8. Exit and Program Termination

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-036 | Exit application immediately | System just started | 1. Start application<br>2. Select option 4 (Exit) | 1. Display shows "Exiting the program. Goodbye!"<br>2. Program terminates gracefully | | | Clean exit without operations |
| TC-037 | Exit application after operations | Performed multiple operations | 1. Credit 500.00<br>2. Debit 200.00<br>3. Select option 4 (Exit) | 1. Display shows "Exiting the program. Goodbye!"<br>2. Program terminates gracefully | | | Clean exit after operations |

---

### 9. Boundary and Edge Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|----------------------|----------------|------------|-----------------|---------------|--------|----------|
| TC-038 | Maximum balance value | Current balance near maximum | 1. Set balance to 999999.98<br>2. Credit 0.01 | Balance becomes 999999.99 | | | Maximum value supported by PIC 9(6)V99 |
| TC-039 | Debit reducing balance to exactly zero | Current balance: 500.00 | 1. Debit 500.00 | 1. Balance becomes 0.00<br>2. Display shows "Amount debited. New balance: 0.00" | | | Zero balance state |
| TC-040 | Operations on zero balance | Current balance: 0.00 | 1. View balance (0.00)<br>2. Credit 100.00 (balance: 100.00)<br>3. Debit 50.00 (balance: 50.00) | All operations complete successfully | | | System behavior with zero balance |
| TC-041 | Decimal precision - two decimal places | Current balance: 1000.00 | 1. Credit 123.45<br>2. Debit 67.89 | Final balance: 1055.56 (with exact decimal precision) | | | Verify decimal calculations are accurate |

---

## Data Constraints and Business Rules

### Identified Business Rules:
1. **Initial Balance**: System starts with a default balance of 1000.00
2. **Balance Format**: Balance supports up to 6 digits with 2 decimal places (max: 999,999.99)
3. **Amount Format**: Transaction amounts support up to 6 digits with 2 decimal places (max: 999,999.99)
4. **Overdraft Protection**: Debits are rejected if the amount exceeds the current balance
5. **Balance Comparison**: Uses >= operator for sufficient funds check (allows exact balance debit)
6. **Data Persistence**: Balance is maintained in memory during program execution
7. **Menu Options**: Only accepts values 1-4; all other inputs show error message
8. **Continuous Operation**: Menu loops until user explicitly selects Exit (option 4)

### Critical Business Logic to Validate:
- ✓ Sufficient funds check for debit operations
- ✓ Accurate balance calculations (addition for credit, subtraction for debit)
- ✓ Balance persistence across operations
- ✓ Input validation for menu choices
- ✓ Decimal precision handling (2 decimal places)
- ✓ Maximum value constraints

---

## Testing Notes for Node.js Migration

### Recommended Test Types:
1. **Unit Tests**: Test individual functions for credit, debit, balance read/write operations
2. **Integration Tests**: Test complete transaction flows and data persistence
3. **Validation Tests**: Test input validation and error handling
4. **Boundary Tests**: Test edge cases and maximum/minimum values
5. **Regression Tests**: Ensure migrated functionality matches COBOL behavior exactly

### Key Migration Considerations:
- Ensure decimal precision is maintained (use appropriate numeric types in Node.js)
- Validate that overdraft protection logic is identical
- Verify balance calculations produce same results
- Test data persistence mechanism (if using database vs. in-memory storage)
- Ensure menu options and error messages match or improve upon original

### Test Data Requirements:
- Initial balance: 1000.00
- Test amounts: 0.01, 0.00, 100.00, 500.00, 999999.99
- Edge balances: 0.00, 999999.99
- Invalid menu inputs: 0, 5, 9, non-numeric values (if applicable)

---

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Business Analyst | | | |
| QA Lead | | | |
| Development Lead | | | |
| Product Owner | | | |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-30 | System | Initial test plan created from COBOL application analysis |

