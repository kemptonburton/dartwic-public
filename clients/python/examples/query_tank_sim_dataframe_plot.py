"""Simple Python dataframe query example for DARTWIC.

This saves a PNG so the example works even when a GUI plot window is awkward.

Dependencies:
    pip install pyzmq matplotlib
"""

from __future__ import annotations

from pathlib import Path
import sys
import time

import matplotlib.dates as mdates
import matplotlib.pyplot as plt


from dartwic_client import DartwicClient


def main() -> None:
    # Connect to the local Tempest server.
    client = DartwicClient()
    client.connect("127.0.0.1", 7000, "admin").raise_for_error()

    try:
        # 1. Find the saved view by name. Its ID stays stable if it is renamed.
        tank_sim = next((frame for frame in client.list_dataframes().values()
                         if frame["name"] == "tank_sim"), None)
        if tank_sim is None:
            raise RuntimeError("No tank_sim dataframe view is saved.")

        # 2. Read its time range. An active view extends to now.
        from_timestamp = tank_sim["from_ns"]
        to_timestamp = tank_sim.get("to_ns") or time.time_ns()

        # 4. Query two channels inside that dataframe time window.
        range_query = client.query_channel_range(
            [
                "|tank_sim_run_tank_fill|",
                "|tank_sim_run_tank_pressure|",
            ],
            from_timestamp=from_timestamp,
            to_timestamp=to_timestamp,
        )

        # 5. Pull the reshaped channel data straight out of the response.
        run_tank_fill = range_query["channels"]["|tank_sim_run_tank_fill|"]
        run_tank_pressure = range_query["channels"]["|tank_sim_run_tank_pressure|"]

        # 6. Plot the values against their timestamps.
        figure, axis_fill = plt.subplots(figsize=(12, 6))
        axis_pressure = axis_fill.twinx()

        axis_fill.plot(
            run_tank_fill["datetimes"],
            run_tank_fill["values"],
            color="#2563eb",
            linewidth=2,
            label="run_tank_fill",
        )
        axis_pressure.plot(
            run_tank_pressure["datetimes"],
            run_tank_pressure["values"],
            color="#dc2626",
            linewidth=2,
            label="run_tank_pressure",
        )

        axis_fill.set_title("tank_sim dataframe query")
        axis_fill.set_xlabel("Timestamp (UTC)")
        axis_fill.set_ylabel("Run Tank Fill")
        axis_pressure.set_ylabel("Run Tank Pressure")
        axis_fill.xaxis.set_major_formatter(mdates.DateFormatter("%H:%M:%S"))
        figure.autofmt_xdate()

        fill_line = axis_fill.lines[0]
        pressure_line = axis_pressure.lines[0]
        axis_fill.legend([fill_line, pressure_line], ["run_tank_fill", "run_tank_pressure"], loc="upper left")

        plt.tight_layout()

        # 7. Save the plot so it is easy to inspect and share.
        output_file = Path.cwd() / "tank_sim_dataframe_plot.png"
        figure.savefig(output_file, dpi=150)
        plt.close(figure)

        print(f"Saved plot to: {output_file}")
    finally:
        client.disconnect()


if __name__ == "__main__":
    main()
