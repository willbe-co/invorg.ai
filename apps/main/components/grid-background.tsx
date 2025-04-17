"use client"

import { useEffect, useRef } from "react"

interface Point {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  speed: number
  targetX: number
  targetY: number
  reachedTarget: boolean
}

export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full width/height
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // Initialize canvas size
    resizeCanvas()

    // Add resize listener
    window.addEventListener("resize", resizeCanvas)

    // Grid settings - larger cells as requested
    const gridSize = 120
    const gridColor = "rgba(50, 50, 50, 0.3)"

    // Points/dots settings - smaller dots with gray colors
    const points: Point[] = []
    const numPoints = 10
    const pointColors = ["rgba(150, 150, 150, 0.7)", "rgba(180, 180, 180, 0.7)", "rgba(120, 120, 120, 0.7)"]

    // Initialize points
    for (let i = 0; i < numPoints; i++) {
      const gridX = Math.floor(Math.random() * (canvas.width / gridSize))
      const gridY = Math.floor(Math.random() * (canvas.height / gridSize))

      points.push({
        x: gridX * gridSize,
        y: gridY * gridSize,
        vx: 0,
        vy: 0,
        // Smaller dots as requested
        size: 2 + Math.random() * 2,
        color: pointColors[Math.floor(Math.random() * pointColors.length)],
        speed: 0.4 + Math.random() * 1,
        targetX: gridX * gridSize,
        targetY: gridY * gridSize,
        reachedTarget: true,
      })
    }

    // Function to find a new target for a point (always on grid intersections)
    const findNewTarget = (point: Point) => {
      const currentGridX = Math.round(point.x / gridSize)
      const currentGridY = Math.round(point.y / gridSize)

      // Choose a direction: horizontal or vertical
      const moveHorizontal = Math.random() > 0.5

      if (moveHorizontal) {
        // Move left or right by 1-3 grid cells
        const steps = 1 + Math.floor(Math.random() * 3)
        const direction = Math.random() > 0.5 ? 1 : -1
        const newGridX = currentGridX + steps * direction

        // Ensure we stay within bounds
        const boundedGridX = Math.max(0, Math.min(Math.floor(canvas.width / gridSize), newGridX))
        point.targetX = boundedGridX * gridSize
        point.targetY = currentGridY * gridSize
      } else {
        // Move up or down by 1-3 grid cells
        const steps = 1 + Math.floor(Math.random() * 3)
        const direction = Math.random() > 0.5 ? 1 : -1
        const newGridY = currentGridY + steps * direction

        // Ensure we stay within bounds
        const boundedGridY = Math.max(0, Math.min(Math.floor(canvas.height / gridSize), newGridY))
        point.targetX = currentGridX * gridSize
        point.targetY = boundedGridY * gridSize
      }

      point.reachedTarget = false

      // Calculate velocity based on direction and speed
      const dx = point.targetX - point.x
      const dy = point.targetY - point.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > 0) {
        point.vx = (dx / distance) * point.speed
        point.vy = (dy / distance) * point.speed
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const time = Date.now() / 10000

      // Draw grid with moving gradient lines
      drawMovingGrid(ctx, canvas.width, canvas.height, gridSize, time)

      // Update and draw points
      points.forEach((point) => {
        // Check if point reached target
        const dx = point.targetX - point.x
        const dy = point.targetY - point.y
        const distanceToTarget = Math.sqrt(dx * dx + dy * dy)

        if (distanceToTarget < 1) {
          point.x = point.targetX
          point.y = point.targetY
          point.reachedTarget = true

          // Find a new target with some delay
          if (Math.random() < 0.02) {
            findNewTarget(point)
          }
        } else {
          // Move toward target
          point.x += point.vx
          point.y += point.vy
        }

        // Draw connection lines between points and their targets
        if (!point.reachedTarget) {
          ctx.beginPath()
          ctx.moveTo(point.x, point.y)
          ctx.lineTo(point.targetX, point.targetY)
          ctx.strokeStyle = point.color.replace("0.7", "0.2")
          ctx.lineWidth = 1
          ctx.stroke()
        }

        // Draw point
        ctx.beginPath()
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2)
        ctx.fillStyle = point.color
        ctx.fill()

        // Draw subtle glow effect
        const glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.size * 2)
        glow.addColorStop(0, point.color)
        glow.addColorStop(0.7, "rgba(0, 0, 0, 0)")

        ctx.beginPath()
        ctx.arc(point.x, point.y, point.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Function to draw moving grid with gradient effect
    const drawMovingGrid = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      gridSize: number,
      time: number,
    ) => {
      // Vertical lines
      for (let x = 0; x <= width; x += gridSize) {
        const gradient = ctx.createLinearGradient(x, 0, x, height)

        // Create moving gradient effect
        const offset = (time * 0.2) % 2

        gradient.addColorStop(0, "rgba(30, 30, 30, 0.1)")
        gradient.addColorStop(Math.max(0, Math.min(1, (0.3 + offset) % 1)), "rgba(70, 70, 70, 0.4)")
        gradient.addColorStop(Math.max(0, Math.min(1, (0.4 + offset) % 1)), "rgba(70, 70, 70, 0.4)")
        gradient.addColorStop(Math.max(0, Math.min(1, (0.7 + offset) % 1)), "rgba(30, 30, 30, 0.1)")
        gradient.addColorStop(1, "rgba(30, 30, 30, 0.1)")

        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y <= height; y += gridSize) {
        const gradient = ctx.createLinearGradient(0, y, width, y)

        // Create moving gradient effect with different timing
        const offset = (time * 0.15) % 2

        gradient.addColorStop(0, "rgba(30, 30, 30, 0.1)")
        gradient.addColorStop(Math.max(0, Math.min(1, (0.3 + offset) % 1)), "rgba(70, 70, 70, 0.4)")
        gradient.addColorStop(Math.max(0, Math.min(1, (0.4 + offset) % 1)), "rgba(70, 70, 70, 0.4)")
        gradient.addColorStop(Math.max(0, Math.min(1, (0.7 + offset) % 1)), "rgba(30, 30, 30, 0.1)")
        gradient.addColorStop(1, "rgba(30, 30, 30, 0.1)")

        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Add occasional brighter highlight lines
      const highlightX = Math.floor(width / gridSize / 2 + Math.sin(time * 0.3) * (width / gridSize / 2)) * gridSize
      const highlightGradient = ctx.createLinearGradient(highlightX, 0, highlightX, height)
      highlightGradient.addColorStop(0, "rgba(40, 40, 40, 0.1)")
      highlightGradient.addColorStop(0.5, "rgba(100, 100, 100, 0.5)")
      highlightGradient.addColorStop(1, "rgba(40, 40, 40, 0.1)")

      ctx.beginPath()
      ctx.moveTo(highlightX, 0)
      ctx.lineTo(highlightX, height)
      ctx.strokeStyle = highlightGradient
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    // Start animation
    animate()

    // Initialize targets for points
    points.forEach((point) => findNewTarget(point))

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-80"
      style={{ pointerEvents: "none" }}
    />
  )
}
