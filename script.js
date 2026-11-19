const userName = document.getElementById("userName")
const userEmail = document.getElementById("userEmail")
const searchInput = document.getElementById("search_input")
const rgstr_btn = document.getElementById("rgstr_btn")
const clear_btn = document.getElementById("clear_input_btn")
const searchBtn = document.getElementById("search_btn")
const searchAllBtn = document.getElementById("search_all_btn")
const removeAllBtn = document.getElementById("remove_all_btn")
const users_sum = document.getElementById("users_sum")
const users_list = document.getElementById("users_list")

const users = JSON.parse(localStorage.getItem("users")) || []

document.addEventListener("DOMContentLoaded", () => {
  searchAll()
  users_sum.innerHTML = `${users.length}`
})

rgstr_btn.addEventListener("click", (e) => {
  e.preventDefault()

  let user = {
    name: "",
    email: "",
  }

  user.name = userName.value
  user.email = userEmail.value

  users.push(user)

  users_sum.innerHTML = `${users.length}`

  localStorage.setItem("users", JSON.stringify(users))

  appendUser(user)
})

clear_btn.addEventListener("click", () => {
  userName.value = ""
  userEmail.value = ""
})

searchInput.addEventListener("input", (e) => {
  e.preventDefault()
  const searchData = searchInput.value

  if (searchData === "") {
    searchAll()
  } else {
    searchFor(searchData)
  }
})

searchBtn.addEventListener("click", () => {
  const searchData = searchInput.value

  if (searchData === "") {
    searchAll()
  } else {
    let searchResponse = searchFor(searchData)

    if (!searchResponse) {
      alert("Usuário não encontrado!")
      searchInput.value = ""
    }
  }
})

// Evento de remoção de todos os registros armazenados no LocalStorage.
removeAllBtn.addEventListener("click", () => {
  let confirmed = confirm(
    "Você realmente deseja limpar a lista? Todos os registros serão removidos e não poderão ser recuperados!",
  )

  if (confirmed) {
    clearList()

    users.splice(0, users.length)

    localStorage.setItem("users", JSON.stringify(users))

    users_sum.innerHTML = `${users.length}`
  } else {
    alert("Operação CANCELADA com sucesso!")
  }
})

searchAllBtn.addEventListener("click", () => {
  searchAll()
  searchInput.value = ""
})

// Função para criar o elemento da lista que representa o usuário
function appendUser(user) {
  const li = document.createElement("li")
  li.classList.add("listed-user")

  const user_data = document.createElement("div")
  user_data.classList.add("user-data")

  const user_name = document.createElement("p")
  user_name.classList.add("user-name")
  user_name.innerHTML = `${user.name}`

  const user_email = document.createElement("p")
  user_email.classList.add("user-email")
  user_email.innerHTML = `${user.email}`

  const actions = document.createElement("div")
  actions.classList.add("actions")

  const remove_user = document.createElement("span")
  remove_user.classList.add("remove-user-button")

  const trash_icon = document.createElement("img")
  trash_icon.src = "../assets/adm_icons/trash.svg"
  trash_icon.alt = "ícone de lixeira"

  users_list.appendChild(li)
  li.appendChild(user_data)
  user_data.appendChild(user_name)
  user_data.appendChild(user_email)
  li.appendChild(actions)
  actions.appendChild(remove_user)
  remove_user.appendChild(trash_icon)

  remove_user.addEventListener("click", () => removeUser(user, li))
}

// Função que remove usuário do array "users" e da lista no HTML. Atualiza o contador
function removeUser(user, li) {
  confirmed = confirm(`Deseja realmente remover este usuário?
    NOME: ${user.name}
    E-MAIL: ${user.email}`)

  if (confirmed) {
    const userIndex = users.indexOf(user)
    users.splice(userIndex, 1)
    localStorage.setItem("users", JSON.stringify(users))

    users_list.removeChild(li)
    users_sum.innerHTML = `${users.length}`
  } else {
    alert("Operação de remoção CANCELADA!")
  }
}

// Função para busca total do "database"
function searchAll() {
  clearList()
  users.forEach((user) => {
    appendUser(user)
  })
}

// Função de busca por texto do input
function searchFor(data) {
  let usersFounded = []

  clearList()

  users.forEach((user) => {
    if (
      normalizeText(user.name).includes(normalizeText(data)) ||
      normalizeText(user.email).includes(normalizeText(data))
    ) {
      usersFounded.push(user)
    }
  })

  if (usersFounded.length === 0) {
    clearList()
    searchAll()
    return false
  } else {
    usersFounded.forEach((user) => {
      appendUser(user)
    })

    return true
  }
}

function clearList() {
  const listItens = document.querySelectorAll(".listed-user")
  listItens.forEach((listItem) => {
    users_list.removeChild(listItem)
  })
}

// Função de normalização de texto com base em Normalização de Decomposição Canônica (NFD) + Remoção global de caracteres gráficos
function normalizeText(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}
