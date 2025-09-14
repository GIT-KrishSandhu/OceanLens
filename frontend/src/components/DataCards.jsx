import { useState, useMemo, useEffect } from "react"
import {
  AlertTriangle, Waves, Thermometer, Droplets, Gauge, Activity,
  CheckCircle, BarChart3, Eye, Zap, ArrowUp, ArrowDown, Download,
  Filter, Search, SortAsc, SortDesc, Grid, List, MoreHorizontal
} from "lucide-react"

import { useNotifications } from "../contexts/NotificationContext"
import { DataQualityTooltip } from "./NotificationSystem"
import {
  LineChart, Line, ResponsiveContainer
} from "recharts"

export function DataCards() {
  const { checkThresholds, checkDataQuality, addNotification } = useNotifications()

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    quality: "all",
    showAlerts: false,
  })

  const [sorting, setSorting] = useState({
    field: "name",
    order: "asc",
  })

  const [viewMode, setViewMode] = useState("grid")
  const [selectedAttributes, setSelectedAttributes] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  // sample dataset
  const dataCards = useMemo(() => [
    {
      id: "temperature",
      title: "Temperature",
      subtitle: "Water Heat Level",
      icon: Thermometer,
      iconColor: "#FF6B6B",
      category: "physical",
      value: 23.5,
      unit: "°C",
      change: +0.3,
      dataQuality: "high",
      trend: [23.2, 23.3, 23.4, 23.5],
      lastUpdated: "5 mins ago",
      status: "normal",
      description: "Sea surface temperature measurement",
    },
    {
      id: "salinity",
      title: "Salinity",
      subtitle: "Salt Concentration",
      icon: Droplets,
      iconColor: "#4ECDC4",
      category: "chemical",
      value: 35.1,
      unit: "PSU",
      change: -0.2,
      dataQuality: "medium",
      trend: [35.3, 35.2, 35.1, 35.1],
      lastUpdated: "10 mins ago",
      status: "warning",
      description: "Seawater salinity concentration",
    },
    {
      id: "pressure",
      title: "Pressure",
      subtitle: "Water Column Pressure",
      icon: Gauge,
      iconColor: "#45B7D1",
      category: "physical",
      value: 1013.2,
      unit: "hPa",
      change: +1.5,
      dataQuality: "high",
      trend: [1012, 1012.5, 1013, 1013.2],
      lastUpdated: "2 mins ago",
      status: "normal",
      description: "Hydrostatic pressure measurement",
    },
    {
      id: "oxygen",
      title: "Dissolved Oxygen",
      subtitle: "O2 Concentration",
      icon: Activity,
      iconColor: "#96CEB4",
      category: "chemical",
      value: 6.8,
      unit: "mg/L",
      change: -0.1,
      dataQuality: "low",
      trend: [7.0, 6.9, 6.8, 6.8],
      lastUpdated: "15 mins ago",
      status: "critical",
      description: "Dissolved oxygen concentration",
    },
  ], [])

  // filtering & sorting
  const filteredAndSortedCards = useMemo(() => {
    let filtered = dataCards.filter((card) => {
      const matchesSearch =
        card.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        card.subtitle.toLowerCase().includes(filters.search.toLowerCase())
      const matchesCategory = filters.category === "all" || card.category === filters.category
      const matchesQuality = filters.quality === "all" || card.dataQuality === filters.quality
      const matchesAlerts = !filters.showAlerts || card.status !== "normal"
      return matchesSearch && matchesCategory && matchesQuality && matchesAlerts
    })

    filtered.sort((a, b) => {
      const order = sorting.order === "asc" ? 1 : -1
      switch (sorting.field) {
        case "name":
          return order * a.title.localeCompare(b.title)
        case "value":
          return order * (a.value - b.value)
        case "change":
          return order * (a.change - b.change)
        case "quality":
          return order * a.dataQuality.localeCompare(b.dataQuality)
        case "updated":
          return order * a.lastUpdated.localeCompare(b.lastUpdated)
        default:
          return 0
      }
    })

    return filtered
  }, [dataCards, filters, sorting])

  // threshold & quality checks
  useEffect(() => {
    dataCards.forEach((card) => {
      checkThresholds(card)
      checkDataQuality(card)
    })
  }, [dataCards, checkThresholds, checkDataQuality])

  // simulated updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomCard = dataCards[Math.floor(Math.random() * dataCards.length)]
      addNotification({
        type: "info",
        title: "Data Update",
        message: `${randomCard.title} measurements updated`,
      })
    }, 45000)
    return () => clearInterval(interval)
  }, [dataCards, addNotification])

  const handleExport = (id) => {
    addNotification({
      type: "success",
      title: "Export Complete",
      message: `${id} data exported successfully`,
    })
  }

  const toggleSelection = (id) => {
    setSelectedAttributes((prev) =>
      prev.includes(id) ? prev.filter((attr) => attr !== id) : [...prev, id]
    )
  }

  return (
    <div style={{ padding: "24px" }}>
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>Ocean Attributes</h2>
          <p style={{ color: "#666" }}>Scientific measurements and parameters</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setViewMode(viewMode === "grid" ? "compact" : "grid")}>
            {viewMode === "grid" ? <List size={20} /> : <Grid size={20} />}
          </button>
          <button onClick={() => setShowFilters(!showFilters)}>
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* filters */}
      {showFilters && (
        <div style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
          <input
            type="text"
            placeholder="Search attributes..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="all">All Categories</option>
            <option value="physical">Physical</option>
            <option value="chemical">Chemical</option>
            <option value="biological">Biological</option>
          </select>
          <select
            value={filters.quality}
            onChange={(e) => setFilters({ ...filters, quality: e.target.value })}
          >
            <option value="all">All Quality</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={sorting.field}
            onChange={(e) => setSorting({ ...sorting, field: e.target.value })}
          >
            <option value="name">Sort by Name</option>
            <option value="value">Sort by Value</option>
            <option value="change">Sort by Change</option>
            <option value="quality">Sort by Quality</option>
            <option value="updated">Sort by Updated</option>
          </select>
          <button
            onClick={() => setSorting({ ...sorting, order: sorting.order === "asc" ? "desc" : "asc" })}
          >
            {sorting.order === "asc" ? <SortAsc size={20} /> : <SortDesc size={20} />}
          </button>
          <label>
            <input
              type="checkbox"
              checked={filters.showAlerts}
              onChange={(e) => setFilters({ ...filters, showAlerts: e.target.checked })}
            />
            Show only alerts
          </label>
        </div>
      )}

      {/* cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(280px, 1fr))" : "1fr",
          gap: "16px",
        }}
      >
        {filteredAndSortedCards.map((card) => (
          <div
            key={card.id}
            onClick={() => toggleSelection(card.id)}
            style={{
              position: "relative",
              padding: "20px",
              borderRadius: "16px",
              background: "#fff",
              boxShadow: selectedAttributes.includes(card.id)
                ? `0 0 12px ${card.iconColor}`
                : "0 2px 8px rgba(0,0,0,0.1)",
              border: selectedAttributes.includes(card.id)
                ? `2px solid ${card.iconColor}`
                : "1px solid #eee",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
          >
            {/* icon */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <card.icon size={24} color={card.iconColor} />
              <div style={{ marginLeft: "8px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>{card.title}</h3>
                <p style={{ fontSize: "12px", color: "#666" }}>{card.subtitle}</p>
              </div>
            </div>

            {/* value */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span style={{ fontSize: "22px", fontWeight: "bold" }}>
                {card.value} {card.unit}
              </span>
              {card.change >= 0 ? (
                <ArrowUp size={18} color="green" />
              ) : (
                <ArrowDown size={18} color="red" />
              )}
              <span style={{ color: card.change >= 0 ? "green" : "red" }}>{card.change}</span>
              <DataQualityTooltip quality={card.dataQuality} />
            </div>

            {/* sparkline */}
            <div style={{ width: "100%", height: "60px", marginBottom: "8px" }}>
              <ResponsiveContainer>
                <LineChart data={card.trend.map((v, i) => ({ x: i, y: v }))}>
                  <Line type="monotone" dataKey="y" stroke={card.iconColor} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* status + export */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "12px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  background:
                    card.status === "critical"
                      ? "#ffe0e0"
                      : card.status === "warning"
                      ? "#fff3cd"
                      : "#e0f7e0",
                  color:
                    card.status === "critical"
                      ? "#b71c1c"
                      : card.status === "warning"
                      ? "#856404"
                      : "#2e7d32",
                }}
              >
                {card.status}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleExport(card.title)
                }}
                style={{ background: "transparent", border: "none", cursor: "pointer" }}
              >
                <Download size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
