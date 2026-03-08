import { useEffect, useState } from 'react'

export const useTypewriter = (words: string[], speed = 50, pause = 2000) => {
    const [index, setIndex] = useState(0)
    const [subIndex, setSubIndex] = useState(0)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        if (!words.length) return

        const timeout = setTimeout(() => {
            if (!deleting && subIndex === words[index].length) {
                setTimeout(() => setDeleting(true), pause)
                return
            }

            if (deleting && subIndex === 0) {
                setDeleting(false)
                setIndex((prev) => (prev + 1) % words.length)
                return
            }

            setSubIndex((prev) => prev + (deleting ? -1 : 1))
        }, deleting ? speed / 2 : speed)

        return () => clearTimeout(timeout)
    }, [subIndex, deleting, index, words])

    return words[index]?.substring(0, subIndex)
}