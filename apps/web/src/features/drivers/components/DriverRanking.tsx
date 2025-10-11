import { Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@fleet/ui-web'

interface RankedDriver {
  id: string
  name: string
  score: number
  rank: number
  trend: number
}

const mockRankings: RankedDriver[] = [
  { id: '1', name: 'John Doe', score: 95, rank: 1, trend: 2 },
  { id: '2', name: 'Jane Smith', score: 92, rank: 2, trend: -1 },
  { id: '3', name: 'Bob Johnson', score: 88, rank: 3, trend: 1 },
  { id: '4', name: 'Alice Williams', score: 85, rank: 4, trend: 0 },
  { id: '5', name: 'Charlie Brown', score: 82, rank: 5, trend: -2 },
]

export function DriverRanking() {
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Driver Leaderboard</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-right">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRankings.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell className="font-bold text-lg">
                  {driver.rank === 1 && '🥇'}
                  {driver.rank === 2 && '🥈'}
                  {driver.rank === 3 && '🥉'}
                  {driver.rank > 3 && driver.rank}
                </TableCell>
                <TableCell className="font-medium">{driver.name}</TableCell>
                <TableCell className="text-right">
                  <span className="text-lg font-bold">{driver.score}</span>
                </TableCell>
                <TableCell className="text-right">
                  {driver.trend > 0 && <span className="text-green-600">↑ {driver.trend}</span>}
                  {driver.trend < 0 && <span className="text-red-600">↓ {Math.abs(driver.trend)}</span>}
                  {driver.trend === 0 && <span className="text-gray-400">-</span>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
