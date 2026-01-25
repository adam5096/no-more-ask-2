HTTP Methods：**POST**

**request** JSON：注意，value 值僅為展示資料參考格式，並非真實數據、排列順序，提供你類推
{
"email": "test1716@example.com",
"password": "@ab123456"
}

**response** JSON：注意，value 值僅為展示資料參考格式，並非真實數據、排列順序，提供你類推
{
"token": "",
"email": "",
"userId": "***"
}

Schema：
LoginDTO：其中欄位出現 "" 表示必填
{
email*      string($email); minLength: 1;
password*   string; minLength: 6;
}

STEP：外部後端端點如下 （ 參考 postman 中設定檔 ）：****