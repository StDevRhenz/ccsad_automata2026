import React, { useEffect, useRef } from 'react'
import styles from './GroupCard.module.css'

export default function GroupCard({ group, onClick }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          card.classList.add(styles.visible)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(card)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      aria-labelledby={`grp-${group.id}-title`}
    >
      <div className={styles.iframeWrapper} aria-hidden="true">
        <iframe className={styles.iframe} src={group.src} title={`Preview of ${group.name}`} tabIndex={-1} />
        <div className={styles.overlay} />
      </div>

      <div className={styles.body}>
        <div id={`grp-${group.id}-title`} className={styles.badge}>Group {String(group.id).padStart(2, '0')}</div>
        <button className={styles.viewBtn} type="button" onClick={(event) => {
          event.stopPropagation()
          onClick()
        }}>
          View Activity
        </button>
      </div>
    </div>
  )
}
