import React, { useEffect, useRef, useState } from 'react'
import styles from './GroupModal.module.css'

export default function GroupModal({ group, onClose }) {
  const shellRef = useRef(null)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') startClose()
    }

    document.addEventListener('keydown', onKey)
    const prev = document.activeElement
    setTimeout(() => shellRef.current?.focus(), 20)
    return () => {
      document.removeEventListener('keydown', onKey)
      prev?.focus()
    }
  }, [])

  function startClose() {
    setClosing(true)
    setTimeout(() => onClose(), 250)
  }

  return (
    <div className={`${styles.shell} ${closing ? styles.shellClose : styles.shellOpen}`} role="dialog" aria-modal="true" aria-label={group.name} ref={shellRef} tabIndex={-1}>
      <header className={styles.header}>
        <div className={styles.name}>{group.name}</div>
        <button className={styles.close} onClick={startClose} aria-label="Close modal">Close</button>
      </header>
      <div className={styles.body}>
        <iframe title={group.name} src={group.src} scrolling="no" />
      </div>
    </div>
  )
}
