

const state = {
    score:{
        playerScore:0,
        computerScore:0,
        scoreBox:document.getElementById("score_points"),
    },
    cardSprites:{
        avatar:document.getElementById("card-image"),
        name:document.getElementById("card_name"),
        type:document.getElementById("card-type"),
    },
    fieldCards:{
        player:document.getElementById("player-field-card"),
        computer:document.getElementById("computer-field-card"),
    },
    actions:{
        button: document.getElementById("next-duel")
    },
    playerSides: {
        player1: 'player-cards',
        player1BOX:document.querySelector("#player-cards"),
        computer: 'computer-cards',
        computerBOX: document.querySelector("#computer-cards")
    }
}

const playersSide = {
    player1: 'player-cards',
    computer: 'computer-cards',
}

const pathImages = './src/assets/icons/'

const cardData = [
    {
        id:0,
        name:'Blue Eyes White Dragon',
        type:'Paper',
        img:`${pathImages}dragon.png`,
        WinOf:[1],
        LoseOf:[2],
    },
    {
        id:1,
        name:'Dark Magician',
        type:'Rock',
        img:`${pathImages}magician.png`,
        WinOf:[2],
        LoseOf:[0],
    },
    {
        id:2,
        name:'Exodia',
        type:'Scissors',
        img:`${pathImages}exodia.png`,
        WinOf:[0],
        LoseOf:[1],
    }
]

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}

async function createCardImage(IdCard, fieldSide){
    const cardImage = document.createElement("img")
    cardImage.setAttribute("height", '100px')
    cardImage.setAttribute("src", './src/assets/icons/card-back.png')
    cardImage.setAttribute("data-id",IdCard)
    cardImage.classList.add("card")

    if(fieldSide === playersSide.player1){
        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"))
        })
        cardImage.addEventListener("mouseover", ()=>{
            drawSelectCard(IdCard)
        })
        cardImage.addEventListener("mouseleave", ()=>{
            removeSelectCard(IdCard)
        })
    }

    return cardImage
}

async function setCardsField(id){
    await removeAllCardsImages()
    let computerCardId = await getRandomCardId()

    state.fieldCards.player.style.display = "block"
    state.fieldCards.computer.style.display = "block"

    state.fieldCards.player.src = cardData[id].img
    state.fieldCards.computer.src = cardData[computerCardId].img

    let duelResults = await checkDuelResults(id, computerCardId)

    await updateScore()
    await drawButton(duelResults)
}

async function drawButton(text){
    state.actions.button.innerText = text.toUpperCase()
    state.actions.button.style.display = "block"
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Empate"

    let playerCard = cardData[playerCardId]
    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "Ganhou"
        await playAudio("win")
        state.score.playerScore++
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "Perdeu"
        await playAudio("lose")
        state.score.computerScore++
    }

    return duelResults
}

async function removeAllCardsImages(){
    let {computerBOX, player1BOX}= state.playerSides
    let imgElements = computerBOX.querySelectorAll("img")
    imgElements.forEach(img=> img.remove())

    imgElements = player1BOX.querySelectorAll("img")
    imgElements.forEach(img=> img.remove())
}

async function drawSelectCard(id){
    state.cardSprites.avatar.src = cardData[id].img
    state.cardSprites.name.innerText = cardData[id].name
    state.cardSprites.type.innerText = "Atribute : "+cardData[id].type
}

async function removeSelectCard(id){
    state.cardSprites.avatar.src = ''
    state.cardSprites.name.innerText = 'Selecione'
    state.cardSprites.type.innerText = "uma carta"
}

async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i<cardNumbers; i++){
        const randomIdCard = await getRandomCardId()
        const cardImage = await createCardImage(randomIdCard, fieldSide)

        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function resetDuel(){
    state.cardSprites.avatar.src = ''
    state.actions.button.style.display = 'none'

    state.fieldCards.player.style.display = 'none'
    state.fieldCards.computer.style.display = 'none'

    init()
}

async function  playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    audio.play()
}

function init(){
    drawCards(5, playersSide.player1)
    drawCards(5, playersSide.computer)
}

init()