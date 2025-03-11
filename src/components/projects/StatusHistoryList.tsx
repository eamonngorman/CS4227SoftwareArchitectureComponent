import React, { useEffect, useState } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';

interface StatusHistory {
  id: number;
  previousStatus: string | null;
  newStatus: string;
  changedAt: string;
}

interface StatusHistoryListProps {
  projectId: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'IN_PROGRESS':
      return 'info';
    case 'COMPLETED':
      return 'success';
    case 'ON_HOLD':
      return 'warning';
    case 'CANCELLED':
      return 'error';
    default:
      return 'default';
  }
};

const StatusHistoryList: React.FC<StatusHistoryListProps> = ({ projectId }) => {
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatusHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/projects/${projectId}/status-history`);
        if (!response.ok) {
          throw new Error('Failed to fetch status history');
        }
        const data = await response.json();
        setStatusHistory(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStatusHistory();
  }, [projectId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (statusHistory.length === 0) {
    return <Alert severity="info">No status changes recorded yet.</Alert>;
  }

  return (
    <Paper sx={{ mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Status History
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Previous Status</TableCell>
              <TableCell>New Status</TableCell>
              <TableCell>Changed At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statusHistory.map((history) => (
              <TableRow key={history.id}>
                <TableCell>
                  {history.previousStatus ? (
                    <Chip
                      label={history.previousStatus}
                      color={getStatusColor(history.previousStatus)}
                      size="small"
                    />
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      Initial Status
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={history.newStatus}
                    color={getStatusColor(history.newStatus)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(history.changedAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default StatusHistoryList; 