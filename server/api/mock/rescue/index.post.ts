import type {
  CreateRescueResponse,
  RescueRequest
} from '~/types/rescue'

// Mock 救援請求資料庫
const mockRequests: RescueRequest[] = []

export default defineEventHandler(async (event): Promise<CreateRescueResponse> => {
  const body = await readBody(event)

  // 模擬網路延遲
  await new Promise(resolve => setTimeout(resolve, 300))

  // 建立新請求
  const newRequest: RescueRequest = {
    id: `rescue-${Date.now()}`,
    status: 'draft',
    scheduledDate: body.scheduledDate,
    duration: body.duration,
    stressLevel: body.stressLevel,
    location: body.location,
    helpNeeded: body.helpNeeded,
    scenario: body.scenario,
    questions: body.questions || [],
    notes: body.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  mockRequests.push(newRequest)

  return {
    success: true,
    request: newRequest
  }
})
