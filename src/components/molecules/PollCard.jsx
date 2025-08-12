import React, { useMemo } from "react";
import { format } from "date-fns";
import Chart from "react-apexcharts";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const PollCard = ({ poll, currentUser, onVote }) => {
  const hasVoted = poll.voters?.includes(currentUser?.Id);
  const totalVotes = poll.votes?.reduce((sum, count) => sum + count, 0) || 0;

  const chartOptions = useMemo(() => ({
    chart: {
      type: 'bar',
      height: 200,
      toolbar: { show: false },
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        dataLabels: {
          position: 'center'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        const count = poll.votes[opts.dataPointIndex];
        return count > 0 ? `${count} (${val.toFixed(1)}%)` : '';
      },
      style: {
        fontSize: '11px',
        fontWeight: 500,
        colors: ['#ffffff']
      }
    },
    xaxis: {
      categories: poll.options,
      labels: {
        show: false
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '11px'
        }
      }
    },
    grid: {
      show: false
    },
    colors: ['#7C3AED'],
    tooltip: {
      enabled: true,
      theme: 'dark',
      y: {
        formatter: (val, opts) => {
          const count = poll.votes[opts.dataPointIndex];
          return `${count} votes (${val.toFixed(1)}%)`;
        }
      }
    },
    legend: { show: false }
  }), [poll.options, poll.votes]);

  const chartSeries = useMemo(() => [{
    data: poll.votes?.map(count => 
      totalVotes > 0 ? (count / totalVotes) * 100 : 0
    ) || []
  }], [poll.votes, totalVotes]);

  const handleVote = (optionIndex) => {
    if (!hasVoted && poll.isActive && onVote) {
      onVote(poll.Id, optionIndex);
    }
  };

  return (
    <div className="bg-surface/40 border border-secondary/20 rounded-lg p-4 space-y-4">
      {/* Poll Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-body font-medium text-white leading-tight">
            {poll.question}
          </h4>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-400">
              by {poll.createdBy}
            </span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-400">
              {format(new Date(poll.createdAt), "MMM d, HH:mm")}
            </span>
          </div>
        </div>
        <Badge
          variant={poll.isActive ? "success" : "secondary"}
          className="ml-2"
        >
          {poll.isActive ? "Active" : "Completed"}
        </Badge>
      </div>

      {/* Voting Interface or Results */}
      {!hasVoted && poll.isActive ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-300 font-medium">Choose an option:</p>
          <div className="space-y-2">
            {poll.options.map((option, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={() => handleVote(index)}
                className="w-full justify-start text-left p-3 border border-secondary/30 hover:border-secondary/50 hover:bg-secondary/10 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ApperIcon name="Circle" size={14} className="text-gray-400" />
                  {option}
                </span>
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-300 font-medium">
              Poll Results
            </p>
            <span className="text-xs text-gray-400">
              {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
            </span>
          </div>

          {/* Chart */}
          {totalVotes > 0 ? (
            <div className="bg-background/50 rounded-lg p-3">
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={Math.max(120, poll.options.length * 30)}
              />
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <ApperIcon name="BarChart3" size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No votes yet</p>
            </div>
          )}

          {/* Status Messages */}
          {hasVoted && (
            <div className="flex items-center gap-2 text-xs text-success bg-success/10 px-2 py-1 rounded">
              <ApperIcon name="CheckCircle" size={12} />
              You voted on this poll
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PollCard;