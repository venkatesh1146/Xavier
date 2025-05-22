"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, Briefcase, DollarSign, BarChart3, Clock } from "lucide-react"
import type { InvestmentAsset } from "./risk-assessment-form"
import { v4 as uuidv4 } from "uuid"

interface InvestmentDataProps {
  investmentAssets: InvestmentAsset[]
  setInvestmentAssets: React.Dispatch<React.SetStateAction<InvestmentAsset[]>>
}

const assetTypes = ["Equity", "Debt", "Real Estate", "Gold", "Cash", "Cryptocurrency", "Commodities", "Others"]

export default function InvestmentData({ investmentAssets, setInvestmentAssets }: InvestmentDataProps) {
  const addAsset = () => {
    const newAsset: InvestmentAsset = {
      id: uuidv4(),
      type: "Equity",
      name: "",
      value: 0,
      expectedReturn: 0,
      tenure: 0,
    }
    setInvestmentAssets([...investmentAssets, newAsset])
  }

  const removeAsset = (id: string) => {
    setInvestmentAssets(investmentAssets.filter((asset) => asset.id !== id))
  }

  const updateAsset = (id: string, field: keyof InvestmentAsset, value: any) => {
    setInvestmentAssets(
      investmentAssets.map((asset) => {
        if (asset.id === id) {
          return { ...asset, [field]: value }
        }
        return asset
      }),
    )
  }

  // Calculate total portfolio value
  const totalValue = investmentAssets.reduce((sum, asset) => sum + asset.value, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Briefcase className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Investment Portfolio</h2>
      </div>

      <p className="text-muted-foreground">Add your current investments to receive a comprehensive risk assessment.</p>

      {/* Portfolio summary */}
      {investmentAssets.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Portfolio Value</h3>
                <p className="text-2xl font-bold">₹{totalValue.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Assets</h3>
                <p className="text-2xl font-bold">{investmentAssets.length}</p>
              </div>
              <Button onClick={addAsset} variant="outline" className="ml-auto flex items-center gap-2 border-dashed">
                <Plus className="h-4 w-4" /> Add Asset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Asset list */}
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {investmentAssets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden border border-border/60">
                <CardContent className="p-0">
                  <div className="bg-muted/30 p-4 flex justify-between items-center">
                    <h3 className="font-medium flex items-center gap-2">
                      <span className="text-primary">Asset {index + 1}</span>
                      {asset.name && <span>- {asset.name}</span>}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAsset(asset.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`asset-type-${asset.id}`} className="flex items-center gap-1">
                        <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" /> Asset Type
                      </Label>
                      <Select value={asset.type} onValueChange={(value) => updateAsset(asset.id, "type", value)}>
                        <SelectTrigger id={`asset-type-${asset.id}`}>
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                        <SelectContent>
                          {assetTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`asset-name-${asset.id}`}>Asset Name</Label>
                      <Input
                        id={`asset-name-${asset.id}`}
                        value={asset.name}
                        onChange={(e) => updateAsset(asset.id, "name", e.target.value)}
                        placeholder="e.g., S&P 500 Index Fund"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`asset-value-${asset.id}`} className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-muted-foreground" /> Current Value (₹)
                      </Label>
                      <Input
                        id={`asset-value-${asset.id}`}
                        type="number"
                        value={asset.value}
                        onChange={(e) => updateAsset(asset.id, "value", Number.parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`asset-return-${asset.id}`} className="flex items-center gap-1">
                        <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" /> Expected Return (%)
                      </Label>
                      <Input
                        id={`asset-return-${asset.id}`}
                        type="number"
                        value={asset.expectedReturn}
                        onChange={(e) =>
                          updateAsset(asset.id, "expectedReturn", Number.parseFloat(e.target.value) || 0)
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`asset-tenure-${asset.id}`} className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Investment Period (years)
                      </Label>
                      <Input
                        id={`asset-tenure-${asset.id}`}
                        type="number"
                        value={asset.tenure}
                        onChange={(e) => updateAsset(asset.id, "tenure", Number.parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {investmentAssets.length === 0 && (
          <div className="text-center py-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <Briefcase className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Assets Added</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Add your investment assets to receive a comprehensive risk assessment and personalized recommendations.
            </p>
            <Button onClick={addAsset} className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Your First Asset
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
