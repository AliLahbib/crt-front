
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Plus, TrendingUp, AlertTriangle, Edit, Trash2, Download, Upload } from "lucide-react"
import { useStocks } from "@/hooks/useStocks"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StockForm } from "@/components/stocks/StockForm"
import { DeleteStockDialog } from "@/components/stocks/DeleteStockDialog"
import { StockMovementForm } from "@/components/stocks/StockMovementForm"
import { Stock } from "@/services/stockService"

export default function Stocks() {
  const { 
    stocks, 
    isLoading, 
    error, 
    createStock, 
    updateStock, 
    deleteStock,
    isCreating,
    isUpdating,
    isDeleting
  } = useStocks()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  
  // États pour les modals
  const [showStockForm, setShowStockForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showMovementForm, setShowMovementForm] = useState(false)
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)

  // Filter stocks based on search, category and status
  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = (stock.name && stock.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (stock.category && stock.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (stock.location && stock.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = filterCategory === "all" || stock.category === filterCategory;
    const matchesStatus = filterStatus === "all" || stock.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate statistics
  const totalItems = stocks.length
  const totalValue = stocks.reduce((sum, stock) => sum + (stock.quantity * 1), 0) // Simplified value calculation
  const availableItems = stocks.filter(stock => stock.status === "Disponible").length
  const lowStockItems = stocks.filter(stock => stock.status === "Faible").length
  const outOfStockItems = stocks.filter(stock => stock.status === "Épuisé").length
  const expiringItems = stocks.filter(stock => {
    if (!stock.expirationDate) return false
    const expirationDate = new Date(stock.expirationDate)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return expirationDate <= thirtyDaysFromNow
  }).length

  // Get unique categories and statuses
  const categories = [...new Set(stocks.map(stock => stock.category))]
  const statuses = [...new Set(stocks.map(stock => stock.status))]

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponible":
        return "bg-green-100 text-green-800"
      case "Faible":
        return "bg-yellow-100 text-yellow-800"
      case "Épuisé":
        return "bg-red-100 text-red-800"
      case "Expiré":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get priority color for expiration
  const getExpirationColor = (expirationDate?: string) => {
    if (!expirationDate) return "text-gray-400"
    
    const expDate = new Date(expirationDate)
    const now = new Date()
    const daysUntilExpiration = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiration < 0) return "text-red-600 font-medium" // Expired
    if (daysUntilExpiration <= 7) return "text-red-500" // Expires within a week
    if (daysUntilExpiration <= 30) return "text-yellow-600" // Expires within a month
    return "text-gray-600"
  }

  // Handlers
  const handleAddStock = () => {
    setSelectedStock(null)
    setShowStockForm(true)
  }

  const handleEditStock = (stock: Stock) => {
    setSelectedStock(stock)
    setShowStockForm(true)
  }

  const handleDeleteStock = (stock: Stock) => {
    setSelectedStock(stock)
    setShowDeleteDialog(true)
  }

  const handleStockFormSubmit = (data: any) => {
    // Convert date to string format for the API
    const formattedData = {
      ...data,
      expirationDate: data.expirationDate ? data.expirationDate.toISOString() : undefined,
    };

    if (selectedStock) {
      updateStock({ 
        id: selectedStock.id!, 
        data: {
          ...formattedData,
          lastUpdated: new Date().toISOString(),
          status: data.quantity <= data.minQuantity ? 
            (data.quantity === 0 ? 'Épuisé' : 'Faible') : 'Disponible'
        }
      })
    } else {
      createStock({
        ...formattedData,
        lastUpdated: new Date().toISOString(),
        status: data.quantity <= data.minQuantity ? 
          (data.quantity === 0 ? 'Épuisé' : 'Faible') : 'Disponible'
      })
    }
    setShowStockForm(false)
    setSelectedStock(null)
  }

  const handleDeleteConfirm = () => {
    if (selectedStock?.id) {
      deleteStock(selectedStock.id)
      setShowDeleteDialog(false)
      setSelectedStock(null)
    }
  }

  const handleMovementSubmit = (data: any) => {
    const stock = stocks.find(s => s.id === data.stockId)
    if (stock) {
      const newQuantity = data.type === 'in' 
        ? stock.quantity + data.quantity 
        : stock.quantity - data.quantity

      updateStock({
        id: stock.id!,
        data: {
          quantity: Math.max(0, newQuantity),
          lastUpdated: new Date().toISOString(),
          status: newQuantity <= stock.minQuantity ? 
            (newQuantity === 0 ? 'Épuisé' : 'Faible') : 'Disponible'
        }
      })
    }
    setShowMovementForm(false)
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Nom', 'Catégorie', 'Quantité', 'Unité', 'Statut', 'Emplacement', 'Date expiration'],
      ...filteredStocks.map(stock => [
        stock.name,
        stock.category,
        stock.quantity.toString(),
        stock.unit,
        stock.status,
        stock.location,
        stock.expirationDate ? new Date(stock.expirationDate).toLocaleDateString('fr-FR') : ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `stocks_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          title="Gestion des Stocks" 
          subtitle="Inventaire et suivi des marchandises et matériel" 
        />
        <main className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Package className="h-8 w-8 animate-spin mx-auto mb-2 text-redCrescent-red" />
              <p>Chargement des stocks...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          title="Gestion des Stocks" 
          subtitle="Inventaire et suivi des marchandises et matériel" 
        />
        <main className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <p className="text-red-600">Erreur lors du chargement des stocks</p>
              <p className="text-sm text-gray-500 mt-2">
                Vérifiez que le serveur JSON est démarré sur le port 3001
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Gestion des Stocks" 
        subtitle="Inventaire et suivi des marchandises et matériel" 
      />
      
      <main className="p-6 space-y-6">
        {/* Actions rapides */}
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={handleAddStock}
            className="bg-redCrescent-red hover:bg-redCrescent-darkRed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel article
          </Button>
          <Button 
            variant="outline" 
            className="border-redCrescent-red text-redCrescent-red hover:bg-redCrescent-red hover:text-white"
            onClick={() => setShowMovementForm(true)}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Mouvement de stock
          </Button>
          <Button 
            variant="outline" 
            className="border-redCrescent-red text-redCrescent-red hover:bg-redCrescent-red hover:text-white"
            onClick={exportToCSV}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total articles</p>
                  <p className="text-2xl font-bold text-redCrescent-red">{totalItems}</p>
                </div>
                <Package className="h-8 w-8 text-redCrescent-red" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Disponibles</p>
                  <p className="text-2xl font-bold text-green-600">{availableItems}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Stock faible</p>
                  <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Épuisé</p>
                  <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
                </div>
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expire bientôt</p>
                  <p className="text-2xl font-bold text-orange-600">{expiringItems}</p>
                </div>
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-orange-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Valeur totale</p>
                  <p className="text-2xl font-bold text-blue-600">{totalValue}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-redCrescent-red"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-redCrescent-red"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des stocks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-redCrescent-red flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Inventaire ({filteredStocks.length} articles)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredStocks.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">
                  {stocks.length === 0 ? "Aucun article en stock" : "Aucun article trouvé avec ces filtres"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Article</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Emplacement</TableHead>
                      <TableHead>Expiration</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStocks.map((stock) => (
                      <TableRow key={stock.id}>
                        <TableCell className="font-medium">{stock.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{stock.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{stock.quantity} {stock.unit}</span>
                            <span className="text-xs text-gray-500">Min: {stock.minQuantity}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(stock.status)}>
                            {stock.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{stock.location}</TableCell>
                        <TableCell>
                          {stock.expirationDate ? (
                            <span className={`text-sm ${getExpirationColor(stock.expirationDate)}`}>
                              {new Date(stock.expirationDate).toLocaleDateString('fr-FR')}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditStock(stock)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteStock(stock)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alertes */}
        {(lowStockItems > 0 || outOfStockItems > 0 || expiringItems > 0) && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-red-600 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Alertes et Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {outOfStockItems > 0 && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <p className="font-medium text-red-800">Stock épuisé</p>
                    <p className="text-sm text-red-600">{outOfStockItems} articles sont épuisés</p>
                  </div>
                )}
                {lowStockItems > 0 && (
                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                    <p className="font-medium text-yellow-800">Stock faible</p>
                    <p className="text-sm text-yellow-600">{lowStockItems} articles ont un stock faible</p>
                  </div>
                )}
                {expiringItems > 0 && (
                  <div className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                    <p className="font-medium text-orange-800">Expiration proche</p>
                    <p className="text-sm text-orange-600">{expiringItems} articles expirent dans les 30 prochains jours</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Modals */}
      <StockForm
        open={showStockForm}
        onOpenChange={setShowStockForm}
        stock={selectedStock}
        onSubmit={handleStockFormSubmit}
        isLoading={isCreating || isUpdating}
      />

      <DeleteStockDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        stock={selectedStock}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      <StockMovementForm
        open={showMovementForm}
        onOpenChange={setShowMovementForm}
        stocks={stocks}
        onSubmit={handleMovementSubmit}
        isLoading={isUpdating}
      />
    </div>
  )
}
