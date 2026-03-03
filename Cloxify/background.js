let activeDomain = null
let startTime = null
let domainTimes = {}

const SUPABASE_URL = "https://mayvkdzpwpujeprgghxr.supabase.co/rest/v1/rpc/add_time"
const SUPABASE_KEY = "sb_publishable_-flrhjd60ZQqyiWQv5FvaA_znP2uqj6"


function generateId() {
  return crypto.randomUUID()
}

async function getUserId() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["user_id"], (result) => {
      if (result.user_id) {
        resolve(result.user_id)
      } else {
        const newId = generateId()
        chrome.storage.local.set({ user_id: newId }, () => {
          console.log("Novo user_id gerado:", newId)
          resolve(newId)
        })
      }
    })
  })
}

async function sendToSupabase(domain, seconds) {
  const userId = await getUserId()

  try {
    const response = await fetch(SUPABASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        p_domain: domain,
        p_seconds: seconds,
        p_user_id: userId
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro Supabase:", errorText)
      return
    }

    console.log(`Tempo enviado: ${domain} +${seconds}s`)
  } catch (error) {
    console.error("Erro fetch:", error)
  }
}


chrome.tabs.onActivated.addListener((activeInfo) => {
  const now = Date.now()

  if (activeDomain && startTime) {
    const timeSpent = now - startTime
    const seconds = Math.floor(timeSpent / 1000)

    if (seconds > 0) {
      if (!domainTimes[activeDomain]) {
        domainTimes[activeDomain] = 0
      }

      domainTimes[activeDomain] += timeSpent
      sendToSupabase(activeDomain, seconds)

      console.log(
        `Domínio ${activeDomain} acumulou ${Math.floor(domainTimes[activeDomain] / 1000)} segundos`
      )
    }
  }

  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (!tab.url || tab.url.startsWith("chrome://")) return

    const url = new URL(tab.url)
    activeDomain = url.hostname
    startTime = Date.now()

    console.log("Novo domínio ativo:", activeDomain)
  })
})


chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    if (activeDomain && startTime) {
      const now = Date.now()
      const timeSpent = now - startTime
      const seconds = Math.floor(timeSpent / 1000)

      if (seconds > 0) {
        if (!domainTimes[activeDomain]) {
          domainTimes[activeDomain] = 0
        }

        domainTimes[activeDomain] += timeSpent
        sendToSupabase(activeDomain, seconds)

        console.log(`Janela perdeu foco - ${activeDomain} +${seconds}s`)
      }

      startTime = null
    }
  } else {
    startTime = Date.now()
  }
})