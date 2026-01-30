# Hypermedia Specification (HATEOAS)

## HATEOAS 與連結治理
*   回應中必須包含 `_links` 物件，引導前端進行下一步操作。
*   格式參考：
```json
{
  "data": { ... },
  "_links": {
    "self": { "href": "/api/v1/resource/1" },
    "next": { "href": "/api/v1/resource/2" }
  }
}
```
*   技術細節：詳見 [hateoas.md](../../../../workflows/hateoas.md)。
