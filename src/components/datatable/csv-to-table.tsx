"use client"
import { Copy, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/useToast";


interface ICsvToTableProps {
  headers: string[],
  csvData: Record<any, any>[];
}
const CsvToTable: React.FC<ICsvToTableProps> = ({ headers, csvData }) => {
  const { toast } = useToast();
  return (
    <>
      <Table>
        <TableHeader className="bg-primary text-primary-foreground rounded-lg">
          <TableRow key={"header-001"}>
            {headers.map((header, index) => (
              <TableHead key={header} className="text-primary-foreground">
                <div className="flex items-center gap-3">
                  <span>{header}</span>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {csvData.map((row, index) => (
            <TableRow className=" even:bg-primary/10" key={index}>
              {Object.keys(row).map((k, index) => (
                <TableCell key={index}>
                  <div className="flex items-center gap-3">
                    <span>{row[k]}</span>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
         
        </TableBody>
      </Table>
    </>
  );
};

export default CsvToTable;
