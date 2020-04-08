import * as React from 'react';

import * as colors from '../colors';
import * as actions from '../redux/actions';
import { TrackItem, TrackItemType } from '../track-item';
import EffectContainer from './effect/Effect.container';
import EventContainer from './event/Event.container';
import AccountContainer from './Account.container';
import styles from './Inspector.css';

type Props = {
  exportTimeline: typeof actions.forecast.exportTimeline;
  importTimeline: typeof actions.forecast.importTimeline;
  removeAccount: typeof actions.forecast.removeAccount;
  removeEffect: typeof actions.forecast.removeEffect;
  removeEvent: typeof actions.forecast.removeEvent;
  selectedAccountId: string | null;
  selectedTrackItem: TrackItem | null;
};

export default function InspectorComponent({
  exportTimeline,
  importTimeline,
  removeAccount,
  removeEffect,
  removeEvent,
  selectedAccountId,
  selectedTrackItem,
}: Props) {
  const importTimelineHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const reader = new FileReader();
    reader.onload = () => {
      importTimeline(JSON.parse(reader.result as string));
    };
    reader.readAsText(event.target.files![0]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content} style={{ flexGrow: 0 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <button className={styles['wide-button']} onClick={exportTimeline}>
            ⇱ Export
          </button>
          <a
            className={styles['wide-button']}
            href="https://youtu.be/7IEB6aaAf3E"
            style={{ color: colors.YELLOW, textAlign: 'center' }}
            target="_blank"
          >
            Demo
          </a>
          <label
            className={styles['wide-button']}
            style={{ display: 'block', overflow: 'hidden', textAlign: 'right' }}
          >
            Import ⇲
            <input
              onChange={importTimelineHandler}
              style={{
                left: -10000,
                position: 'absolute',
                opacity: 0,
                zIndex: -100,
              }}
              type="file"
            />
          </label>
        </div>
      </div>

      {selectedAccountId && (
        <>
          <Header title="Account">
            <HeaderButton
              onClick={() => {
                const message = 'Are you sure you want to delete this account?';
                if (window.confirm(message)) {
                  removeAccount(selectedAccountId);
                }
              }}
            >
              🗑
            </HeaderButton>
          </Header>
          <AccountContainer accountId={selectedAccountId} />
        </>
      )}

      {selectedTrackItem && (
        <TrackItemComponent
          removeEffect={removeEffect}
          removeEvent={removeEvent}
          trackItem={selectedTrackItem}
        />
      )}
    </div>
  );
}

type TrackItemComponentProps = {
  removeEffect: typeof actions.forecast.removeEffect;
  removeEvent: typeof actions.forecast.removeEvent;
  trackItem: TrackItem;
};

function TrackItemComponent({
  removeEffect,
  removeEvent,
  trackItem,
}: TrackItemComponentProps) {
  switch (trackItem.type) {
    case TrackItemType.Effect:
      return (
        <>
          <Header title="Effect">
            <HeaderButton onClick={() => removeEffect(trackItem.id)}>
              🗑
            </HeaderButton>
          </Header>
          <div className={styles['greedy-content']}>
            <EffectContainer effectId={trackItem.id} />
          </div>
        </>
      );
    case TrackItemType.Event:
      return (
        <>
          <Header title="Event">
            <HeaderButton onClick={() => removeEvent(trackItem.id)}>
              🗑
            </HeaderButton>
          </Header>
          <div className={styles['greedy-content']}>
            <EventContainer eventId={trackItem.id} />
          </div>
        </>
      );
    default:
      return <div className={styles.header}>(not implemented)</div>;
  }
}

type HeaderProps = {
  children?: React.ReactNode;
  title: string;
};

function Header({ children, title }: HeaderProps) {
  return (
    <div className={styles.header}>
      <span className={styles['header-title']}>{title}</span>
      <div className={styles['header-children']}>{children}</div>
    </div>
  );
}

type HeaderButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

function HeaderButton({ children, ...props }: HeaderButtonProps) {
  return (
    <button className={styles['header-button']} {...props}>
      {children}
    </button>
  );
}
