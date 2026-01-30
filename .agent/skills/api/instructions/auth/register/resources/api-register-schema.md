HTTP Methods：**POST**

**request** JSON：注意，value 值僅為展示資料參考格式，並非真實數據，提供你類推
{
  "email": "user@example.com",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "displayName": "string"
}

**response** JSON：注意，value 值僅為展示資料參考格式，並非真實數據，提供你類推
{
    "token": "***"
    "email": "***",
    "userId": "***"
}

**Schema**：
RegisterDTO：其中欄位出現 "*" 表示必填
{
email*	    string($email); minLength: 1;
password*	string; minLength: 6;
firstName*	string; minLength: 1;
lastName*	string; minLength: 1;
displayName	string; nullable: true;
}

**外部後端端點**：`****`
提醒前端工程師查找：
1 postman 設定檔位置