const url_UF = "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
const selectUF = document.getElementById('estado')
const tbodyMunicipios = document.getElementById('municipios')
const paginacaoDiv = document.getElementById('paginacao')

let municipios = []
let paginaAtual = 1
const itensPorPagina = 20  

function getUF() {
    axios.get(url_UF)
        .then(response => {
            const estados = response.data

            estados.forEach(uf => {
                const option = document.createElement('option')
                option.value = uf.sigla
                option.textContent = uf.nome
                selectUF.appendChild(option)
            })

            selectUF.addEventListener('change', () => {
                const UF = selectUF.value
                getMunicipios(UF)
            })
        })
        .catch(error => console.log(error))
}

function getMunicipios(UF) {
    const url_municipios = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF}/municipios`
    tbodyMunicipios.innerHTML = ""
    paginacaoDiv.innerHTML = ""
    paginaAtual = 1

    axios.get(url_municipios)
        .then(response => {
            municipios = response.data
            mostrarPagina(paginaAtual)
            criarPaginacao()
        })
        .catch(error => console.log(error))
}

function mostrarPagina(pagina) {
    tbodyMunicipios.innerHTML = ""

    const inicio = (pagina - 1) * itensPorPagina
    const fim = inicio + itensPorPagina
    const paginaMunicipios = municipios.slice(inicio, fim)

    paginaMunicipios.forEach(m => {
        const tr = document.createElement('tr')
        const td = document.createElement('td')
        td.textContent = m.nome
        tr.appendChild(td)
        tbodyMunicipios.appendChild(tr)
    })
}

function criarPaginacao() {
    paginacaoDiv.innerHTML = ""

    const totalPaginas = Math.ceil(municipios.length / itensPorPagina)

    const btnAnterior = document.createElement('button')
    btnAnterior.textContent = '⬅️ Anterior'
    btnAnterior.classList.add('pagina-btn')
    btnAnterior.disabled = (paginaAtual === 1)
    btnAnterior.addEventListener('click', () => {
        if (paginaAtual > 1) {
            paginaAtual--
            mostrarPagina(paginaAtual)
            criarPaginacao()
        }
    })
    paginacaoDiv.appendChild(btnAnterior)


    const spanPagina = document.createElement('span')
    spanPagina.textContent = `Página ${paginaAtual} de ${totalPaginas}`
    spanPagina.classList.add('pagina-info')
    paginacaoDiv.appendChild(spanPagina)

   
    const btnProximo = document.createElement('button')
    btnProximo.textContent = 'Próximo ➡️'
    btnProximo.classList.add('pagina-btn')
    btnProximo.disabled = (paginaAtual === totalPaginas)
    btnProximo.addEventListener('click', () => {
        if (paginaAtual < totalPaginas) {
            paginaAtual++
            mostrarPagina(paginaAtual)
            criarPaginacao()
        }
    })
    paginacaoDiv.appendChild(btnProximo)
}

getUF()
