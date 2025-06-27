import { motion } from "motion/react"
import { useState } from 'react'

type Props = {
  title_en: string, 
  title_romanji: string, 
  title_native: string, 
  popularity: number, 
  avg_score: number, 
  mean_score: number, 
  coverURL: string, 
  bannerURL: string, 
  mature: boolean, 
  ecchi: boolean, 
  length: number, // chapters OR episodes
  units: number, // volumes OR seasons (NaN for one-shots/movies?)
  genres: string[], 
  tags: string[], 
  origin: string, 
  endDate: number, // null/NaN for ongoing media
  type: string, 
  constraintRef: any,
}

export default function Card( {
    title_en,
    title_romanji,
    title_native,
    popularity,
    avg_score,
    mean_score,
    coverURL,
    bannerURL,
    mature,
    ecchi,
    length,
    units,
    genres,
    tags,
    origin,
    endDate,
    type,
    constraintRef, 
  } : Props) {
  const [activeDirection, setActiveDirection] = useState<"x" | "y" | null>(
        null
    )

  return (
    <>
      <motion.div 
                drag  
                dragDirectionLock 
                onDirectionLock={ (direction) => setActiveDirection(direction) }
                onDragEnd={() => setActiveDirection(null)}
                dragConstraints={constraintRef}
                dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
                dragElastic={1}
                whileDrag={{ cursor: "grabbing" }}
                 className='w-3/5 max-w-100 min-w-[240px] dark:text-zinc-200 bg-zinc-200 dark:bg-[#141112] px-2 py-2 rounded-3xl h-3/4'>
        <p>test</p>
      </motion.div>
    </>
  )
}

