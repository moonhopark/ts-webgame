"use strict";
var Hero = /** @class */ (function () {
    function Hero(mine) {
        this.mine = mine;
        this.att = Math.ceil(Math.random() * 2);
        this.hp = Math.ceil(Math.random() * 5) + 25;
        this.hero = true;
        this.field = true;
    }
    return Hero;
}());
var Sub = /** @class */ (function () {
    function Sub(mine) {
        this.field = false;
        this.mine = mine;
        this.att = Math.ceil(Math.random() * 5);
        this.hp = Math.ceil(Math.random() * 5);
        this.cost = Math.floor((this.att + this.hp) / 2);
    }
    return Sub;
}());
function isSub(data) {
    if (data.cost) {
        return true;
    }
    else {
        return false;
    }
}
function isHero(data) {
    if (data.hero) {
        return true;
    }
    else {
        return false;
    }
}
var opponent = {
    hero: document.getElementById('rival-hero'),
    deck: document.getElementById('rival-deck'),
    field: document.getElementById('rival-cards'),
    cost: document.getElementById('rival-cost'),
    deckData: [],
    heroData: null,
    fieldData: [],
    chosenCard: null,
    chosenCardData: null
};
var me = {
    hero: document.getElementById('my-hero'),
    deck: document.getElementById('my-deck'),
    field: document.getElementById('my-cards'),
    cost: document.getElementById('my-cost'),
    deckData: [],
    heroData: null,
    fieldData: [],
    chosenCard: null,
    chosenCardData: null
};
var turnButton = document.getElementById('turn-btn');
var turn = true; // ture면 내턴, false면 상대턴
function initiate() {
    [opponent, me].forEach(function (item) {
        item.deckData = [];
        item.heroData = null;
        item.fieldData = [];
        item.chosenCard = null;
        item.chosenCardData = null;
    });
    createDeck({ mine: true, count: 5 }); // 내 덱 생성
    createDeck({ mine: false, count: 5 }); // 상대 덱 생성
    createHero({ mine: true }); // 내 히어로 생성
    createHero({ mine: false }); // 상대 히어로 생성
    redrawScreen({ mine: true }); // 내 화면
    redrawScreen({ mine: false }); // 상대 화면
}
initiate();
function createDeck(_a) {
    var mine = _a.mine, count = _a.count;
    var player = mine ? me : opponent;
    for (var i = 0; i < count; i++) {
        player.deckData.push(new Sub(mine));
    }
    redrawDeck(player);
}
function createHero(_a) {
    var mine = _a.mine;
    var player = mine ? me : opponent;
    player.heroData = new Hero(mine);
    connectCardDOM({ data: player.heroData, DOM: player.hero, hero: true });
}
function redrawScreen(_a) {
    var mine = _a.mine;
    var player = mine ? me : opponent;
    redrawField(player);
    redrawDeck(player);
    redrawHero(player);
}
function redrawHero(target) {
    if (!target.heroData) {
        throw new Error('heroData가 없습니다.');
    }
    target.hero.innerHTML = '';
    connectCardDOM({ data: target.heroData, DOM: target.hero, hero: true });
}
function redrawDeck(target) {
    target.deck.innerHTML = '';
    target.deckData.forEach(function (data) {
        connectCardDOM({ data: data, DOM: target.deck });
    });
}
function redrawField(target) {
    target.field.innerHTML = '';
    target.fieldData.forEach(function (data) {
        connectCardDOM({ data: data, DOM: target.field });
    });
}
function connectCardDOM(_a) {
    var _b;
    var data = _a.data, DOM = _a.DOM, hero = _a.hero;
    var cardEl = (_b = document.querySelector('.card-hidden .card')) === null || _b === void 0 ? void 0 : _b.cloneNode(true);
    cardEl.querySelector('.card-att').textContent = String(data.att);
    cardEl.querySelector('.card-hp').textContent = String(data.hp);
    if (hero) {
        cardEl.querySelector('.card-cost').style.display = 'none';
        var name_1 = document.createElement('div');
        name_1.textContent = '영웅';
        cardEl.appendChild(name_1);
    }
    else {
        cardEl.querySelector('.card-cost').textContent = String(data.cost);
    }
    cardEl.addEventListener('click', function () {
        if (isSub(data) && data.mine === turn && !data.field) {
            // 쫄병이면
            if (!deckToField({ data: data })) {
                // 쫄병 하나 뽑으면
                createDeck({ mine: turn, count: 1 }); // 덱에 새로운 쫄병 하나 추가
            }
        }
        turnAction({ cardEl: cardEl, data: data });
    });
    DOM.appendChild(cardEl);
}
function deckToField(_a) {
    var data = _a.data;
    var target = turn ? me : opponent;
    var currentCost = Number(target.cost.textContent);
    if (currentCost < data.cost) {
        alert('코스트가 모자릅니다.');
        return true;
    }
    data.field = true;
    var idx = target.deckData.indexOf(data);
    target.deckData.splice(idx, 1);
    target.fieldData.push(data);
    redrawDeck(target);
    redrawField(target);
    target.cost.textContent = String(currentCost - data.cost);
    return false;
}
function turnAction(_a) {
    var cardEl = _a.cardEl, data = _a.data;
    var team = turn ? me : opponent; // 지금 턴의 편
    var enemy = turn ? opponent : me; // 그 상대 편
    if (cardEl.classList.contains('card-turnover')) {
        // 턴이 끝난 카드면 아무일도 일어나지 않음
        return;
    }
    var enemyCard = turn ? !data.mine : data.mine;
    if (enemyCard && team.chosenCardData) {
        // 선택한 카드가 있고 적군 카드를 클릭한 경우 공격
        data.hp = data.hp - team.chosenCardData.att;
        if (data.hp <= 0) {
            // 카드가 죽었을 때
            if (isSub(data)) {
                var index = enemy.fieldData.indexOf(data);
                enemy.fieldData.splice(index, 1);
            }
            else {
                // 영웅이 죽었을 떄
                alert('승리하셨습니다!');
                initiate();
            }
        }
        redrawScreen({ mine: !turn }); // 상대 화면 다시 그리기
        if (team.chosenCard) {
            // 클릭 해제 후 카드 행동 종료
            team.chosenCard.classList.remove('card-selected');
            team.chosenCard.classList.add('card-turnover');
        }
        team.chosenCard = null;
        team.chosenCardData = null;
        return;
    }
    if (data.field) {
        // 카드가 필드에 있으면
        // 영웅 부모와 필드카드의 부모가 다르기때문에 document에서 모든 .card를 검색한다
        // 카드.parentNode.querySelectorAll('.card').forEach(function (card) {
        document.querySelectorAll('.card').forEach(function (card) {
            card.classList.remove('card-selected');
        });
        console.log(cardEl);
        cardEl.classList.add('card-selected');
        team.chosenCard = cardEl;
        team.chosenCardData = data;
    }
    2;
}
turnButton.addEventListener('click', function () {
    var target = turn ? me : opponent;
    document.getElementById('rival').classList.toggle('turn');
    document.getElementById('my').classList.toggle('turn');
    redrawField(target);
    redrawHero(target);
    turn = !turn; // 턴을 넘김
    if (turn) {
        me.cost.textContent = '10';
    }
    else {
        opponent.cost.textContent = '10';
    }
});
