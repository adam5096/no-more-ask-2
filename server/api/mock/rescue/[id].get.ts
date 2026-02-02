import type { GetRescueResponse, RescueRequest } from '~/types/rescue'

// Mock 資料 - 預設一些範例請求
const mockRequests: RescueRequest[] = [
  {
    id: 'rescue-demo-001',
    status: 'pending',
    scheduledDate: '2026-02-10T18:00:00+08:00',
    duration: 3,
    stressLevel: 4,
    location: '台北市大安區某餐廳',
    helpNeeded: '幫我擋住親戚的連環問題，特別是關於感情和工作的',
    scenario: {
      description: '除夕夜家族聚餐，預計有 15 人以上',
      expectedParticipants: '爸媽、叔叔阿姨、表哥表姐'
    },
    questions: [
      { content: '怎麼還沒交男/女朋友？', suggestedResponse: '緣分還沒到，不急' },
      { content: '薪水多少？', suggestedResponse: '夠用就好，公司規定不能說' },
      { content: '什麼時候結婚？', suggestedResponse: '順其自然' }
    ],
    notes: '希望 Helper 可以幫我轉移話題',
    createdAt: '2026-02-01T10:00:00+08:00',
    updatedAt: '2026-02-01T10:00:00+08:00'
  }
]

export default defineEventHandler(async (event): Promise<GetRescueResponse> => {
  const id = getRouterParam(event, 'id')

  await new Promise(resolve => setTimeout(resolve, 200))

  const request = mockRequests.find(r => r.id === id)

  if (!request) {
    throw createError({
      statusCode: 404,
      message: '找不到此救援請求'
    })
  }

  return {
    request
  }
})
