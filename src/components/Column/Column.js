import React from 'react';
import PropTypes from 'prop-types';
import { Droppable } from 'react-beautiful-dnd';

import { settings } from '../../data/dataStore';

import Card from '../Card/Card';
import Creator from '../Creator/Creator';
import Icon from '../Icon/Icon';

import styles from './Column.scss';

const Column = ({ id, title, icon, cards, addCard }) => (
  <section className={styles.component}>
    <h3 className={styles.title}>
      <span className={styles.icon}>
        <Icon name={icon}/>
      </span>
      {title}
    </h3>
    <Droppable droppableId={id}>
      {provided => (
        <div
          className={styles.cards}
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          {cards.map(cardData => (
            <Card key={cardData.id} {...cardData} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
    <Creator text={settings.cardCreatorText} action={addCard}/>
  </section>
);

Column.propTypes = {
  title: PropTypes.string.isRequired,
  cards: PropTypes.array,
  icon: PropTypes.string,
  addCard: PropTypes.func,
  id: PropTypes.string,
  listId: PropTypes.string,
};

Column.defaultProps = {
  icon: settings.defaultColumnIcon,
};

export default Column;