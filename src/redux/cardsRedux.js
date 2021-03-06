import shortid from 'shortid';

// selectors
export const getCardsForColumn = ({cards}, columnId) => cards.filter(card => card.columnId == columnId).sort((a, b) => a.index - b.index);
export const getCardsForSearchResults = ({cards}, searchString) => cards.filter(card => new RegExp(searchString, 'i').test(card.title));

// action name creator
const reducerName = 'cards';
const createActionName = name => `app/${reducerName}/${name}`;

// action types
export const ADD_CARD = createActionName('ADD_CARD');
export const MOVE_CARD = createActionName('MOVE_CARD');

// action creators
export const createActionAddCard = payload => ({ payload: { ...payload, id: shortid.generate() }, type: ADD_CARD });
export const createActionMoveCard = payload => ({ payload, type: MOVE_CARD });

// reducer
export default function reducer(statePart = [], action = {}) {
  switch (action.type) {
    case ADD_CARD: {
      const newCardIndex = statePart.filter(card => card.columnId == action.payload.columnId).length;
      const newCard = { index: newCardIndex, ...action.payload };
      
      return [...statePart, newCard];
    }
    case MOVE_CARD: {
      const {id, src, dest} = action.payload;

      const targetCard = statePart.filter(card => card.id == id)[0];
      const targetColumnCards = statePart.filter(card => card.columnId == dest.columnId).sort((a, b) => a.index - b.index);

      if(dest.columnId == src.columnId){
        targetColumnCards.splice(src.index, 1);
        targetColumnCards.splice(dest.index, 0, targetCard);

        return statePart.map(card => {
          const targetColumnIndex = targetColumnCards.indexOf(card);

          if(targetColumnIndex > -1 && card.index != targetColumnIndex){
            return {...card, index: targetColumnIndex};
          } else {
            return card;
          }
        });
      } else {
        let sourceColumnCards = statePart.filter(card => card.columnId == src.columnId).sort((a, b) => a.index - b.index);

        sourceColumnCards.splice(src.index, 1);
        targetColumnCards.splice(dest.index, 0, targetCard);

        return statePart.map(card => {
          const targetColumnIndex = targetColumnCards.indexOf(card);
          if(card == targetCard){
            return {...card, index: targetColumnIndex, columnId: dest.columnId};
          } else if(targetColumnIndex > -1 && card.index != targetColumnIndex){
            return {...card, index: targetColumnIndex};
          } else {
            const sourceColumnIndex = sourceColumnCards.indexOf(card);

            if(sourceColumnIndex > -1 && card.index != sourceColumnIndex){
              return {...card, index: sourceColumnIndex};
            } else {
              return card;
            }
          }
        });
      }
    }
    default:
      return statePart;
  }
}