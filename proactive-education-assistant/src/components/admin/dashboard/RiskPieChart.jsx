import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const RiskPieChart = ({ data }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        Risk Distribution
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `${value} students`}
            contentStyle={{ 
              fontSize: '12px', 
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}
          />
          <Legend 
            iconSize={10}
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
