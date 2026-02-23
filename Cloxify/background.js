let activeDomain = null
let startTime = null
let domainTimes = {}

const SUPABASE_URL = "https://mayvkdzpwpujeprgghxr.supabase.co/rest/v1/rpc/add_time"
const SUPABASE_KEY = "sb_publishable_-flrhjd60ZQqyiWQv5FvaA_znP2uqj6"

// Envia dados para Supabase
async function sendToSupabase(domain, seconds) {
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
        p_user_name: "pedrao" // Substitua por lógica de usuário real se necessário
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro Supabase:", errorText)
      return
    }

    console.log("Tempo incrementado com sucesso")

  } catch (error) {
    console.error("Erro fetch:", error)
  }
}

// Quando troca de aba
chrome.tabs.onActivated.addListener((activeInfo) => {
  const now = Date.now()

  // Salva tempo do domínio anterior
  if (activeDomain && startTime) {
    const timeSpent = now - startTime

    if (!domainTimes[activeDomain]) {
      domainTimes[activeDomain] = 0
    }

    domainTimes[activeDomain] += timeSpent

    const seconds = Math.floor(timeSpent / 1000)

    sendToSupabase(activeDomain, seconds)

    console.log(
      `Domínio ${activeDomain} acumulou ${Math.floor(domainTimes[activeDomain] / 1000)} segundos`
    )
  }

  // Pega nova aba
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (!tab.url || tab.url.startsWith("chrome://")) return

    const url = new URL(tab.url)
    activeDomain = url.hostname
    startTime = Date.now()

    console.log("Novo domínio ativo:", activeDomain)
  })
})

// Quando perde foco da janela
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    if (activeDomain && startTime) {
      const now = Date.now()
      const timeSpent = now - startTime
      const seconds = Math.floor(timeSpent / 1000)

      if (!domainTimes[activeDomain]) {
        domainTimes[activeDomain] = 0
      }

      domainTimes[activeDomain] += timeSpent

      sendToSupabase(activeDomain, seconds)

      console.log(
        `Janela perdeu foco - ${activeDomain} +${seconds}s`
      )

      startTime = null
    }
  } else {
    startTime = Date.now()
  }
})