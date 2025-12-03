'use server'

import { serverCookies } from '@/lib/cookies.server'
import { createOnboardingClient } from '@/lib/axios-clients'
import { OnboardingData, OnboardingResponse } from '@/types/auth'

/**
 * Server Action: Submit onboarding data
 * 
 * Sends data to ONBOARDING_SERVICE using Axios client with Bearer token
 * Requires authentication token from httpOnly cookie
 */
export async function submitOnboardingAction(data: OnboardingData) {
  try {
    const token = await serverCookies.getToken()
    
 console.log('Onboarding token:', token)

    // Call ONBOARDING_SERVICE using Axios client with Bearer token
    const onboardingClient = createOnboardingClient(() => token)
    const response = await onboardingClient.post<OnboardingResponse>('/onboarding', data)
    console.log('Onboarding response:', response.data)
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
