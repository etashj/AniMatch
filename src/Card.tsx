import { motion, useAnimation } from "motion/react"
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
  const animControls = useAnimation();
  const randomDeg = Math.floor(Math.random() * 20) - 10; // -5 to 5 deg
  
  function offScreen (activeDir: string, sign: number) {
    if (activeDir == 'x') { 
      animControls.start( { x:750*sign, opacity:0 } ); 
    }
    else if (activeDir == 'y') {
      animControls.start( { y:750*sign, opacity:0 } ); 
    }
  }

  return (
    <>
      <motion.div 
                animate = {animControls}
                drag  
                onDragEnd={(_, info) => {
                    setActiveDirection(null);
                    if (Math.abs(info.offset.x) > 200 ) {
                        offScreen('x', Math.sign(info.offset.x)); 
                        console.log('chi');
                    } else {
                        // Animate to be offscreen
                    }
                }}
                dragConstraints={{ top: 10, right: 0, bottom: 10, left: 0 }}
                dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
                dragElastic={1}
                whileDrag={{ cursor: "grabbing" }}
               className='w-3/5 max-w-100 min-w-[240px] dark:text-zinc-200 bg-zinc-200 dark:bg-[#141112] px-2 py-2 rounded-3xl h-3/4 absolute shadow-xl dark:shadow-black-900/30 shadow-black-900 hover:scale-105 transition duration-50'
                style={{ transform: `rotate(${randomDeg}deg)`, touchAction: "none" }}>
        <p>{title_en}</p>
      </motion.div>
    </>
  )
}

