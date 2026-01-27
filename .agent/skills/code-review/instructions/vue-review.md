# Vue/Nuxt 審查指引

基於 `.agent/workflows/construction/vue/` 與 `code-review-checklist.md`。

---

## 檢查項目

### 1. 組件結構順序

**必須遵守的順序**：
1. Imports（外部依賴）
2. DefineProps / DefineEmits（輸入/輸出契約）
3. Reactive State / Refs（響應式狀態）
4. Computed Properties（計算屬性）
5. Methods / Functions（方法/函數）
6. Watchers（監聽器）
7. Lifecycle Hooks（生命週期鉤子）

**正確範例**：
```vue
<script setup lang="ts">
// 1. Imports
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

// 2. Props & Emits
const props = defineProps<{ userId: string }>()
const emit = defineEmits<{ update: [id: string] }>()

// 3. State
const isLoading = ref(false)

// 4. Computed
const displayName = computed(() => `User: ${props.userId}`)

// 5. Methods
function handleClick() { /* ... */ }

// 6. Watchers (if any)

// 7. Lifecycle
onMounted(() => { /* ... */ })
</script>
```

---

### 2. Composable 設計

**命名規範**：
- [ ] 是否使用 `use[Feature]` 命名模式？
- [ ] 名稱是否清楚表達業務領域？

**單一職責**：
- [ ] 是否只負責一個業務領域？
- [ ] 是否避免混合多個業務邏輯？

**正確範例**：
```typescript
// ✅ 單一職責
export function useRescueRequestDetails(requestId: string) {
  const { data, pending, error } = useFetch(`/api/rescue-requests/${requestId}/details`)
  return { data, pending, error }
}
```

**錯誤範例**：
```typescript
// ❌ 多個職責混合
export function useRescueRequest(requestId: string) {
  const request = useFetch(`/api/rescue-requests/${requestId}`)
  const helper = useFetch(`/api/helpers/${request.data.value?.helperId}`)
  const map = useFetch(`/api/map/${request.data.value?.locationId}`)
  // 太多職責
}
```

---

### 3. Inline Composable

當邏輯只在當前組件使用時，可使用 Inline Composable：

```vue
<script setup>
const { message, toggleReverse } = useMessage()
</script>

<script>
function useMessage() {
  const originalMessage = ref('Hello')
  const isReversed = ref(false)
  
  const message = computed(() => isReversed.value ? /* ... */ : originalMessage.value)
  
  function toggleReverse() {
    isReversed.value = !isReversed.value
  }
  
  return { message, toggleReverse }
}
</script>
```

---

## 審查時的判斷

| 情況 | 判定 |
|------|------|
| 組件結構順序錯亂 | ⚠️ 建議改進 |
| Composable 名稱不符規範 | ⚠️ 建議改進 |
| Composable 混合多個職責 | ❌ 需要修改 |
| 函數超過 50 行 | ⚠️ 建議拆分 |
