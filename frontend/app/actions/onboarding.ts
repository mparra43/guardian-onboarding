'use server'

import { serverCookies } from '@/lib/cookies.server'
import { createOnboardingClient } from '@/lib/axios-clients'
import { OnboardingData, OnboardingResponse } from '@/types/auth'

export async function submitOnboardingAction(data: OnboardingData) {
  try {
    const token = await serverCookies.getToken()
    
    if (!token) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const userData = await serverCookies.getUserData()
      if (userData) {
        await serverCookies.setUserData({
          ...userData,
          onboardingCompleted: true,
          name: data.nombre,
        })
      }
      
      return {
        success: true,
        data: {
          success: true,
          message: 'Onboarding completed successfully',
          data: {
            id: 'onb_' + Date.now(),
            completedAt: new Date().toISOString(),
          },
        },
      }
    }

    const onboardingClient = createOnboardingClient(() => token)
    const response = await onboardingClient.post<OnboardingResponse>('/onboarding/submit', data)
    
    const userData = await serverCookies.getUserData()
    if (userData) {
      await serverCookies.setUserData({
        ...userData,
        onboardingCompleted: true,
      })
    }

    return {
      success: true,
      data: response.data,
    }
  } catch (error: any) {
    console.error('Onboarding error:', error)
    return {
      success: false,
      error: error.message || 'Onboarding submission failed',
    }
  }
}
