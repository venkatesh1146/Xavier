"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, Briefcase, DollarSign, BarChart3, Clock, Building2, TrendingUp, Calendar, FileText, Shield, CircleDollarSign, ChevronDown, ChevronRight } from "lucide-react"
import type { InvestmentAsset } from "./risk-assessment-form"
import { v4 as uuidv4 } from "uuid"

interface InvestmentDataProps {
  investmentAssets: InvestmentAsset[]
  setInvestmentAssets: React.Dispatch<React.SetStateAction<InvestmentAsset[]>>
}

const assetTypes = [
  "Equities (Stocks)",
  "Fixed Income (Bonds)",
  "Real Estate",
  "Cash & Equivalents",
  "Gold & Precious Metals",
  "Alternative Investments",
  "Cryptocurrencies",
  "Mutual Funds",
  "ETFs",
  "Retirement Accounts"
]

const riskCategories = ["Very Low", "Low", "Medium", "High", "Very High"]

export default function InvestmentData({ investmentAssets, setInvestmentAssets }: InvestmentDataProps) {
  const [expandedOptionalSections, setExpandedOptionalSections] = useState<Record<string, boolean>>({})
  const [expandedAssetSpecificSections, setExpandedAssetSpecificSections] = useState<Record<string, boolean>>({})

  const toggleOptionalSection = (assetId: string) => {
    setExpandedOptionalSections(prev => ({
      ...prev,
      [assetId]: !prev[assetId]
    }))
  }

  const toggleAssetSpecificSection = (assetId: string) => {
    setExpandedAssetSpecificSections(prev => ({
      ...prev,
      [assetId]: !prev[assetId]
    }))
  }

  const addAsset = () => {
    const newAsset: InvestmentAsset = {
      id: uuidv4(),
      asset_type: "Equities (Stocks)",
      name: "",
      amount: 0,
      expected_returns: 0,
      current_value: 0,
      tenure: 0,
    }
    setInvestmentAssets([...investmentAssets, newAsset])
  }

  const removeAsset = (id: string) => {
    setInvestmentAssets(investmentAssets.filter((asset) => asset.id !== id))
    // Clean up expanded state
    setExpandedOptionalSections(prev => {
      const newState = { ...prev }
      delete newState[id]
      return newState
    })
    setExpandedAssetSpecificSections(prev => {
      const newState = { ...prev }
      delete newState[id]
      return newState
    })
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
  const totalValue = investmentAssets.reduce((sum, asset) => sum + (asset.current_value || asset.amount), 0)

  // Check if asset is stocks/equities
  const isEquity = (assetType: string) => assetType === "Equities (Stocks)"
  
  // Check if asset is real estate
  const isRealEstate = (assetType: string) => assetType === "Real Estate"

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
                  <div className="p-4 space-y-6">
                    {/* Required Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`asset-type-${asset.id}`} className="flex items-center gap-1">
                          <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" /> Asset Type
                        </Label>
                        <Select value={asset.asset_type} onValueChange={(value) => updateAsset(asset.id, "asset_type", value)}>
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
                        <Label htmlFor={`asset-name-${asset.id}`} className="flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" /> Asset Name
                        </Label>
                        <Input
                          id={`asset-name-${asset.id}`}
                          value={asset.name}
                          onChange={(e) => updateAsset(asset.id, "name", e.target.value)}
                          placeholder="e.g., Apple Stock, US Treasury Bonds"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`asset-amount-${asset.id}`} className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-muted-foreground" /> Initial Investment (₹)
                        </Label>
                        <Input
                          id={`asset-amount-${asset.id}`}
                          type="number"
                          value={asset.amount}
                          onChange={(e) => updateAsset(asset.id, "amount", Number.parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`asset-return-${asset.id}`} className="flex items-center gap-1">
                          <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" /> Expected Returns (%)
                        </Label>
                        <Input
                          id={`asset-return-${asset.id}`}
                          type="number"
                          value={asset.expected_returns || ""}
                          onChange={(e) =>
                            updateAsset(asset.id, "expected_returns", Number.parseFloat(e.target.value) || undefined)
                          }
                          placeholder="e.g., 12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`asset-tenure-${asset.id}`} className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Holding Period (years)
                        </Label>
                        <Input
                          id={`asset-tenure-${asset.id}`}
                          type="number"
                          value={asset.tenure || ""}
                          onChange={(e) => updateAsset(asset.id, "tenure", Number.parseFloat(e.target.value) || undefined)}
                          placeholder="e.g., 2.5"
                        />
                      </div>
                    </div>

                    {/* Optional Fields */}
                    <div className="border-t pt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => toggleOptionalSection(asset.id)}
                        className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
                      >
                        <h4 className="text-sm font-medium text-muted-foreground">Optional Details</h4>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">
                            {expandedOptionalSections[asset.id] ? "Hide" : "Show"}
                          </span>
                          {expandedOptionalSections[asset.id] ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </Button>
                      
                      <AnimatePresence initial={false}>
                        {expandedOptionalSections[asset.id] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                              <div className="space-y-2">
                                <Label htmlFor={`asset-current-value-${asset.id}`} className="flex items-center gap-1">
                                  <CircleDollarSign className="h-3.5 w-3.5 text-muted-foreground" /> Current Value (₹)
                                </Label>
                                <Input
                                  id={`asset-current-value-${asset.id}`}
                                  type="number"
                                  value={asset.current_value || ""}
                                  onChange={(e) =>
                                    updateAsset(asset.id, "current_value", Number.parseFloat(e.target.value) || undefined)
                                  }
                                  placeholder="Current market value"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`asset-purchase-date-${asset.id}`} className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Purchase Date
                                </Label>
                                <Input
                                  id={`asset-purchase-date-${asset.id}`}
                                  type="date"
                                  value={asset.purchase_date || ""}
                                  onChange={(e) => updateAsset(asset.id, "purchase_date", e.target.value || undefined)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`asset-risk-${asset.id}`} className="flex items-center gap-1">
                                  <Shield className="h-3.5 w-3.5 text-muted-foreground" /> Risk Category
                                </Label>
                                <Select value={asset.risk_category || ""} onValueChange={(value) => updateAsset(asset.id, "risk_category", value || undefined)}>
                                  <SelectTrigger id={`asset-risk-${asset.id}`}>
                                    <SelectValue placeholder="Select risk level" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {riskCategories.map((risk) => (
                                      <SelectItem key={risk} value={risk}>
                                        {risk}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                                <Label htmlFor={`additional-notes-${asset.id}`} className="flex items-center gap-1">
                                  <FileText className="h-3.5 w-3.5 text-muted-foreground" /> Additional Notes
                                </Label>
                                <Textarea
                                  id={`additional-notes-${asset.id}`}
                                  value={asset.additional_notes || ""}
                                  onChange={(e) => updateAsset(asset.id, "additional_notes", e.target.value || undefined)}
                                  placeholder="Any other relevant information about this investment..."
                                  rows={2}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Asset-specific fields */}
                    {(isEquity(asset.asset_type) || isRealEstate(asset.asset_type)) && (
                      <div className="border-t pt-4">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => toggleAssetSpecificSection(asset.id)}
                          className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
                        >
                          <div className="text-left">
                            <h4 className="text-sm font-medium text-muted-foreground">
                              {isEquity(asset.asset_type) ? "Stock Details" : "Real Estate Details"}
                            </h4>
                            <p className="text-xs text-muted-foreground/80 mt-0.5">
                              Help us personalize your recommendations more accurately
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              {expandedAssetSpecificSections[asset.id] ? "Hide" : "Show"}
                            </span>
                            {expandedAssetSpecificSections[asset.id] ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </Button>
                        
                        <AnimatePresence initial={false}>
                          {expandedAssetSpecificSections[asset.id] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                                {isEquity(asset.asset_type) && (
                                  <>
                                    <div className="space-y-2">
                                      <Label htmlFor={`company-name-${asset.id}`}>Company Name</Label>
                                      <Input
                                        id={`company-name-${asset.id}`}
                                        value={asset.company_name || ""}
                                        onChange={(e) => updateAsset(asset.id, "company_name", e.target.value || undefined)}
                                        placeholder="e.g., Apple Inc."
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`shares-${asset.id}`}>Number of Shares</Label>
                                      <Input
                                        id={`shares-${asset.id}`}
                                        type="number"
                                        value={asset.shares || ""}
                                        onChange={(e) => updateAsset(asset.id, "shares", Number.parseFloat(e.target.value) || undefined)}
                                        placeholder="e.g., 100"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`purchase-price-${asset.id}`}>Purchase Price per Share (₹)</Label>
                                      <Input
                                        id={`purchase-price-${asset.id}`}
                                        type="number"
                                        value={asset.purchase_price || ""}
                                        onChange={(e) => updateAsset(asset.id, "purchase_price", Number.parseFloat(e.target.value) || undefined)}
                                        placeholder="e.g., 150"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`dividend-yield-${asset.id}`}>Dividend Yield (%)</Label>
                                      <Input
                                        id={`dividend-yield-${asset.id}`}
                                        type="number"
                                        value={asset.dividend_yield || ""}
                                        onChange={(e) => updateAsset(asset.id, "dividend_yield", Number.parseFloat(e.target.value) || undefined)}
                                        placeholder="e.g., 2.5"
                                      />
                                    </div>
                                  </>
                                )}
                                {isRealEstate(asset.asset_type) && (
                                  <>
                                    <div className="space-y-2">
                                      <Label htmlFor={`property-type-${asset.id}`} className="flex items-center gap-1">
                                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" /> Property Type
                                      </Label>
                                      <Select value={asset.property_type || ""} onValueChange={(value) => updateAsset(asset.id, "property_type", value || undefined)}>
                                        <SelectTrigger id={`property-type-${asset.id}`}>
                                          <SelectValue placeholder="Select property type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="residential">Residential</SelectItem>
                                          <SelectItem value="commercial">Commercial</SelectItem>
                                          <SelectItem value="industrial">Industrial</SelectItem>
                                          <SelectItem value="land">Land</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`rental-income-${asset.id}`}>Monthly Rental Income (₹)</Label>
                                      <Input
                                        id={`rental-income-${asset.id}`}
                                        type="number"
                                        value={asset.rental_income || ""}
                                        onChange={(e) => updateAsset(asset.id, "rental_income", Number.parseFloat(e.target.value) || undefined)}
                                        placeholder="e.g., 25000"
                                      />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                      <Label htmlFor={`mortgage-details-${asset.id}`}>Mortgage Details</Label>
                                      <Input
                                        id={`mortgage-details-${asset.id}`}
                                        value={asset.mortgage_details || ""}
                                        onChange={(e) => updateAsset(asset.id, "mortgage_details", e.target.value || undefined)}
                                        placeholder="e.g., ₹50L outstanding, 8.5% interest"
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
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
