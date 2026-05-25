import React, { useState, useEffect, useRef } from 'react'
import { groups } from '../data/groups'
import GroupCard from '../components/GroupCard'
import GroupModal from '../components/GroupModal'

export default function HomePage() {
  const [activeGroup, setActiveGroup] = useState(null)
  const heroRef = useRef(null)

  useEffect(() => {
    const lines = heroRef.current?.querySelectorAll('.line') || []
    lines.forEach((el, i) => setTimeout(() => el.classList.add('visible'), i * 120))
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = activeGroup ? 'hidden' : previousOverflow

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [activeGroup])

  return (
    <main className="container">
      <div className="hero" ref={heroRef}>
        <div className="meta">University of Makati · III-CCSAD · Automata Theory and Formal Languages</div>
        <div className="title page-title">AUTOMATA</div>
        <div className="prof">Professor: Prof. Lester Glover Diampoc</div>
      </div>

      <p className="section-header">— Activities —</p>

      <section className="grid">
        {groups.map((g) => (
          <GroupCard key={g.id} group={g} onClick={() => setActiveGroup(g)} />
        ))}
      </section>

      {activeGroup && (
        <GroupModal group={activeGroup} onClose={() => setActiveGroup(null)} />
      )}
    </main>
  )
}
