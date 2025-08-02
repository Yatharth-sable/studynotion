import React from "react";

const Stats = () => {
  const stats = [
    { count: "5k", label: "Action Students" },
    { count: "10+", label: "Mentors" },
    { count: "200", label: "Courses" },
    { count: "50+", label: "Awards" },
  ];
  return (
    <div className="text-white flex ">
      {stats.map((value, index) => (
        <div className="" key={index}>
          <h1>{value.count}</h1>
          <h2>{value.label}</h2>
        </div>
      ))}
    </div>
  );
};

export default Stats;
