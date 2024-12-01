import fetch from 'node-fetch';
import { createProxyAgent } from './proxy.js'; 

async function fetchWithProxy(url, options, proxy) {
  try {
    const agent = proxy ? createProxyAgent(proxy) : null;
    const updatedOptions = { ...options, agent };
    const response = await fetch(url, updatedOptions);
    if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
    } catch (error) {
        console.error(`Error during fetch ${url}:`, error.message);
    }
}

// Fetch user info
export async function getUserInfo(token, proxy) {
  const url = 'https://fishing-frenzy-api-0c12a800fbfe.herokuapp.com/v1/users/me';
  try {
    return await fetchWithProxy(
      url,
      { method: 'GET', headers: { Authorization: `Bearer ${token}` } },
      proxy
    );
  } catch (error) {
    return null;
  }
}
export async function useItem(token, proxy, itemId, id) {
  
  const url = `https://fishing-frenzy-api-0c12a800fbfe.herokuapp.com/v1/items/${itemId}/use?userId=${id}`;
  try {
    return await fetchWithProxy(
      url,
      { method: 'GET', headers: { Authorization: `Bearer ${token}` } },
      proxy
    );
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
  
}
export async function buyFishing(token, proxy, id) {
  
  const url = `https://fishing-frenzy-api-0c12a800fbfe.herokuapp.com/v1/items/66b1f692aaa0b594511c2db2/buy?userId=${id}&quantity=1`;
  try {
    return await fetchWithProxy(
      url,
      { method: 'GET', headers: { Authorization: `Bearer ${token}` } },
      proxy
    );
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
}


// Claim daily reward
export async function claimDailyReward(token, proxy) {
  const url = 'https://fishing-frenzy-api-0c12a800fbfe.herokuapp.com/v1/daily-rewards/claim';
  try {
    return await fetchWithProxy(
      url,
      { method: 'GET', headers: { Authorization: `Bearer ${token}` } },
      proxy
    );
  } catch (error) {
    console.error('Error claiming daily reward:', error);
    return null;
  }
}

export async function completeTutorial(token, proxy, id) {
  const url = `https://fishing-frenzy-api-0c12a800fbfe.herokuapp.com/v1/users/${id}/complete-tutorial`;
  try {
    const response = await fetchWithProxy(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          origin: 'https://fishingfrenzy.co',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      },
      proxy
    );
    
    return response;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

// Fetch social quests
export async function getSocialQuests(token, proxy) {
  const url = 'https://fishing-frenzy-api-0c12a800fbfe.herokuapp.com/v1/social-quests/';
  try {
    return await fetchWithProxy(
      url,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
      proxy
    );
  } catch (error) {
    console.error('Error fetching social quests:', error);
    return [];
  }
}

// Verify a social quest
export async function verifyQuest(token, id, proxy) {
  const url = `https://fishing-frenzy-api-0c12a800fbfe.herokuapp.com/v1/social-quests/${id}/verify`;
  try {
    return await fetchWithProxy(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          origin: 'https://fishingfrenzy.co',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      },
      proxy
    );
  } catch (error) {
    console.error('Error verifying quest:', error);
    return null;
  }
}
// Fetch inventory
export async function getInventory(token, proxy) {
  const url = 'https://fishing-frenzy-api-0c12a800fbfe.herokuapp.com/v1/inventory';
  try {
    return await fetchWithProxy(
      url,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
      proxy
    );
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
}
