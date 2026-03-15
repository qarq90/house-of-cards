| Hand (A) | Hand (B) | Greater of Hand | Mirror Active | Echo Active | A + Sum = F | B + Sum = F | Previous Value | To Play | Previous Card Type                |
| -------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | -------------- | ------- | --------------------------------- |
| Numeric  | Numeric  | ?               | No            | No          | F = Limit   | No          | ?              | A       | ?                                 |
| Numeric  | Numeric  | ?               | No            | No          | No          | F = Limit   | ?              | B       | ?                                 |
| -------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | -------------- | ------- | --------------------------------- |
| Numeric  | Hallows  | A               | No            | No          | F > Limit   | No          | ?              | Hallows | ?                                 |
| Hallows  | Numeric  | B               | No            | No          | No          | F > Limit   | ?              | Hallows | ?                                 |
| Hallows  | Hallows  | ?               | No            | No          | No          | No          | ?              | Hallows | ?                                 |
| -------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | -------------- | ------- | --------------------------------- |
| Numeric  | Numeric  | ?               | ?             | Yes         | F = Limit   | No          | ?              | A       | ?                                 |
| Numeric  | Numeric  | ?               | ?             | Yes         | No          | F = Limit   | ?              | B       | ?                                 |
| Numeric  | Numeric  | A               | No            | Yes         | F > Limit   | No          | ?              | B       | ?                                 |
| Numeric  | Numeric  | B               | No            | Yes         | No          | F > Limit   | ?              | A       | ?                                 |
| Numeric  | Numeric  | A               | No            | Yes         | No          | F > Limit   | ?              | A       | ?                                 |
| Numeric  | Numeric  | B               | No            | Yes         | F > Limit   | No          | ?              | B       | ?                                 |
| Numeric  | Hallows  | ?               | No            | Yes         | F > Limit   | No          | ?              | Hallows | ?                                 |
| Hallows  | Numeric  | ?               | No            | Yes         | No          | F > Limit   | ?              | Hallows | ?                                 |
| Numeric  | Shield   | ?               | No            | Yes         | F > Limit   | No          | ?              | Shield  | ?                                 |
| Shield   | Numeric  | ?               | No            | Yes         | No          | F > Limit   | ?              | Shield  | ?                                 |
| Numeric  | Echo     | ?               | No            | Yes         | F > Limit   | No          | ?              | Echo    | ?                                 |
| Echo     | Numeric  | ?               | No            | Yes         | No          | F > Limit   | ?              | Echo    | ?                                 |
| Numeric  | Swap     | ?               | No            | Yes         | F > Limit   | No          | ?              | Swap    | ?                                 |
| Swap     | Numeric  | ?               | No            | Yes         | No          | F > Limit   | ?              | Swap    | ?                                 |
| Numeric  | Mirror   | ?               | No            | Yes         | F > Limit   | No          | ?              | Mirror  | ?                                 |
| Mirror   | Numeric  | ?               | No            | Yes         | No          | F > Limit   | ?              | Mirror  | ?                                 |
| Hallows  | Hallows  | ?               | No            | Yes         | ?           | ?           | ?              | Hallows | ?                                 |
| Shield   | Shield   | ?               | No            | Yes         | ?           | ?           | ?              | Shield  | ?                                 |
| Mirror   | Mirror   | ?               | No            | Yes         | ?           | ?           | ?              | Mirror  | ?                                 |
| Swap     | Swap     | ?               | No            | Yes         | ?           | ?           | ?              | Swap    | ?                                 |
| Echo     | Echo     | ?               | No            | Yes         | ?           | ?           | ?              | Echo    | ?                                 |
| -------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | -------------- | ------- | --------------------------------- |
| Numeric  | Numeric  | ?               | Yes           | ?           | F = Limit   | No          | ?              | A       | ?                                 |
| Numeric  | Numeric  | ?               | Yes           | ?           | No          | F = Limit   | ?              | B       | ?                                 |
| Numeric  | Numeric  | A               | Yes           | No          | F > Limit   | No          | ?              | B       | ?                                 |
| Numeric  | Numeric  | B               | Yes           | No          | No          | F > Limit   | ?              | A       | ?                                 |
| Numeric  | Numeric  | A               | Yes           | No          | No          | F > Limit   | ?              | A       | ?                                 |
| Numeric  | Numeric  | B               | Yes           | No          | F > Limit   | No          | ?              | B       | ?                                 |
| Numeric  | Hallows  | ?               | Yes           | No          | F > Limit   | No          | ?              | Hallows | ?                                 |
| Hallows  | Numeric  | ?               | Yes           | No          | No          | F > Limit   | ?              | Hallows | ?                                 |
| Numeric  | Shield   | ?               | Yes           | No          | F > Limit   | No          | ?              | Shield  | ?                                 |
| Shield   | Numeric  | ?               | Yes           | No          | No          | F > Limit   | ?              | Shield  | ?                                 |
| Numeric  | Echo     | ?               | Yes           | No          | F > Limit   | No          | ?              | Echo    | ?                                 |
| Echo     | Numeric  | ?               | Yes           | No          | No          | F > Limit   | ?              | Echo    | ?                                 |
| Numeric  | Swap     | ?               | Yes           | No          | F > Limit   | No          | ?              | Swap    | ?                                 |
| Swap     | Numeric  | ?               | Yes           | No          | No          | F > Limit   | ?              | Swap    | ?                                 |
| Numeric  | Mirror   | ?               | Yes           | No          | F > Limit   | No          | ?              | Mirror  | ?                                 |
| Mirror   | Numeric  | ?               | Yes           | No          | No          | F > Limit   | ?              | Mirror  | ?                                 |
| Hallows  | Hallows  | ?               | Yes           | No          | ?           | ?           | ?              | Hallows | ?                                 |
| Shield   | Shield   | ?               | Yes           | No          | ?           | ?           | ?              | Shield  | ?                                 |
| Mirror   | Mirror   | ?               | Yes           | No          | ?           | ?           | ?              | Mirror  | ?                                 |
| Swap     | Swap     | ?               | Yes           | No          | ?           | ?           | ?              | Swap    | ?                                 |
| Echo     | Echo     | ?               | Yes           | No          | ?           | ?           | ?              | Echo    | ?                                 |
| -------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | -------------- | ------- | --------------------------------- |
| Numeric  | Numeric  | A               | Yes           | No          | F < Limit   | No          | ?              | A       | ?                                 |
| Numeric  | Numeric  | B               | Yes           | No          | No          | F < Limit   | ?              | B       | ?                                 |
| Numeric  | Numeric  | A               | No            | Yes         | F < Limit   | No          | ?              | A       | ?                                 |
| Numeric  | Numeric  | B               | No            | Yes         | No          | F < Limit   | ?              | B       | ?                                 |
| Numeric  | Numeric  | A               | No            | No          | F < Limit   | No          | ?              | A       | ?                                 |
| Numeric  | Numeric  | B               | No            | No          | No          | F < Limit   | ?              | B       | ?                                 |
| -------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | -------------- | ------- | --------------------------------- |
| Numeric  | Mirror   | ?               | No            | No          | F > Limit   | No          | 0-9            | Mirror  | (First card - no previous number) |
| Mirror   | Numeric  | ?               | No            | No          | No          | F > Limit   | 0-9            | Mirror  | (First card - no previous number) |
| -------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | -------------- | ------- | --------------------------------- |
| Numeric  | Numeric  | ?               | Yes           | Yes         | F = Limit   | No          | ?              | A       | ?                                 |
| Numeric  | Numeric  | ?               | Yes           | Yes         | No          | F = Limit   | ?              | B       | ?                                 |
| Numeric  | Numeric  | A               | Yes           | Yes         | F > Limit   | No          | ?              | B       | ?                                 |
| Numeric  | Numeric  | B               | Yes           | Yes         | No          | F > Limit   | ?              | A       | ?                                 |
| Numeric  | Numeric  | A               | Yes           | Yes         | No          | F > Limit   | ?              | A       | ?                                 |
| Numeric  | Numeric  | B               | Yes           | Yes         | F > Limit   | No          | ?              | B       | ?                                 |
| Numeric  | Numeric  | A               | Yes           | Yes         | F < Limit   | No          | ?              | A       | ?                                 |
| Numeric  | Numeric  | B               | Yes           | Yes         | No          | F < Limit   | ?              | B       | ?                                 |
| -------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | -------------- | ------- | --------------------------------- |
| Numeric  | Hallows  | ?               | Yes           | No          | F > Limit   | No          | ?              | Hallows | ?                                 |
| Hallows  | Numeric  | ?               | Yes           | No          | No          | F > Limit   | ?              | Hallows | ?                                 |
| Numeric  | Hallows  | ?               | Yes           | Yes         | F > Limit   | No          | ?              | Hallows | ?                                 |
| Hallows  | Numeric  | ?               | Yes           | Yes         | No          | F > Limit   | ?              | Hallows | ?                                 |
| Numeric  | Hallows  | ?               | No            | Yes         | F > Limit   | No          | ?              | Hallows | (duplicate check)                 |
| Hallows  | Numeric  | ?               | No            | Yes         | No          | F > Limit   | ?              | Hallows | (duplicate check)                 |
| -------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | -------------- | ------- | --------------------------------- |
| Hallows  | Hallows  | ?               | Yes           | Yes         | F > Limit   | No          | ?              | Hallows | ?                                 |
| Hallows  | Hallows  | ?               | Yes           | Yes         | No          | F > Limit   | ?              | Hallows | ?                                 |
| Hallows  | Hallows  | ?               | Yes           | Yes         | F = Limit   | No          | ?              | Hallows | ?                                 |
| Hallows  | Hallows  | ?               | Yes           | Yes         | No          | F = Limit   | ?              | Hallows | ?                                 |
| Hallows  | Hallows  | ?               | Yes           | Yes         | F < Limit   | No          | ?              | Hallows | ?                                 |
| Hallows  | Hallows  | ?               | Yes           | Yes         | No          | F < Limit   | ?              | Hallows | ?                                 |
| -------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | -------------- | ------- | --------------------------------- |
| Shield   | Echo     | ?               | No            | Yes         | ?           | ?           | ?              | Shield  | (Shield cancelling Echo)          |
| Echo     | Shield   | ?               | No            | Yes         | ?           | ?           | ?              | Shield  | ?                                 |
| Shield   | Mirror   | ?               | Yes           | No          | ?           | ?           | ?              | Shield  | (Shield cancelling Mirror)        |
| Mirror   | Shield   | ?               | Yes           | No          | ?           | ?           | ?              | Shield  | ?                                 |
| -------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | -------------- | ------- | --------------------------------- |
| Echo     | Mirror   | ?               | Yes           | Yes         | ?           | ?           | ?              | ?       | (Both active simultaneously)      |
| Mirror   | Echo     | ?               | Yes           | Yes         | ?           | ?           | ?              | ?       | ?                                 |
| Numeric  | Swap     | ?               | No            | No          | ?           | ?           | ?              | Swap    | ?                                 |
| Swap     | Numeric  | ?               | No            | No          | ?           | ?           | ?              | Swap    | ?                                 |
| Swap     | Swap     | ?               | No            | No          | ?           | ?           | ?              | Swap    | ?                                 |
| Echo     | Special  | ?               | No            | Yes         | ?           | ?           | ?              | Special | Special                           |
| Special  | Numeric  | ?               | No            | Yes         | ?           | ?           | ?              | Numeric | Echo                              |
| -------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | -------------- | ------- | --------------------------------- |
| Hallows  | Shield   | ?               | No            | No          | ?           | ?           | ?              | Hallows | ?                                 |
| Shield   | Hallows  | ?               | No            | No          | ?           | ?           | ?              | Hallows | ?                                 |
| Hallows  | Echo     | ?               | No            | No          | ?           | ?           | ?              | Hallows | ?                                 |
| Echo     | Hallows  | ?               | No            | No          | ?           | ?           | ?              | Hallows | ?                                 |
| Hallows  | Mirror   | ?               | No            | No          | ?           | ?           | ?              | Hallows | ?                                 |
| Mirror   | Hallows  | ?               | No            | No          | ?           | ?           | ?              | Hallows | ?                                 |
| Hallows  | Swap     | ?               | No            | No          | ?           | ?           | ?              | Hallows | ?                                 |
| Swap     | Hallows  | ?               | No            | No          | ?           | ?           | ?              | Hallows | ?                                 |
| Shield   | Swap     | ?               | No            | No          | ?           | ?           | ?              | Swap    | ?                                 |
| Swap     | Shield   | ?               | No            | No          | ?           | ?           | ?              | Swap    | ?                                 |
| Echo     | Swap     | ?               | No            | Yes         | ?           | ?           | ?              | Swap    | Echo                              |
| Swap     | Echo     | ?               | No            | No          | ?           | ?           | ?              | Echo    | Swap                              |
| Mirror   | Swap     | ?               | Yes           | No          | ?           | ?           | ?              | Swap    | Mirror                            |
| Swap     | Mirror   | ?               | No            | No          | ?           | ?           | ?              | Mirror  | Swap                              |
| -------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | -------------- | ------- | --------------------------------- |
| Mirror   | Mirror   | ?               | No            | No          | ?           | ?           | None           | Mirror  | None                              |
| Mirror   | Echo     | ?               | No            | No          | ?           | ?           | None           | Echo    | Mirror                            |
| Echo     | Mirror   | ?               | No            | Yes         | ?           | ?           | None           | Mirror  | Echo                              |
| -------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | -------------- | ------- | --------------------------------- |
| Echo     | Hallows  | ?               | No            | Yes         | ?           | ?           | ?              | Hallows | Echo                              |
| Echo     | Shield   | ?               | No            | Yes         | ?           | ?           | ?              | Shield  | Echo                              |
| Echo     | Mirror   | ?               | No            | Yes         | ?           | ?           | ?              | Mirror  | Echo                              |
| Echo     | Swap     | ?               | No            | Yes         | ?           | ?           | ?              | Swap    | Echo                              |
| -------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | -------------- | ------- | --------------------------------- |
| Swap     | Hallows  | ?               | No            | No          | ?           | ?           | ?              | Hallows | Swap                              |
| Hallows  | Swap     | ?               | No            | No          | ?           | ?           | ?              | Hallows | Swap                              |
| Swap     | Echo     | ?               | No            | No          | ?           | ?           | ?              | Echo    | Swap                              |
| Swap     | Mirror   | ?               | No            | No          | ?           | ?           | ?              | Mirror  | Swap                              |
| -------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | -------------- | ------- | --------------------------------- |
| Echo     | Mirror   | ?               | Yes           | Yes         | ?           | ?           | Numeric        | Mirror  | Echo                              |
| Mirror   | Echo     | ?               | Yes           | Yes         | ?           | ?           | Numeric        | Echo    | Mirror                            |
| -------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | -------------- | ------- | --------------------------------- |
| Shield   | Shield   | ?               | No            | No          | ?           | ?           | ?              | Shield  | ?                                 |
| Echo     | Echo     | ?               | No            | Yes         | ?           | ?           | ?              | Echo    | Echo                              |
| Mirror   | Mirror   | ?               | Yes           | No          | ?           | ?           | Numeric        | Mirror  | Mirror                            |
| Swap     | Swap     | ?               | No            | No          | ?           | ?           | ?              | Swap    | Swap                              |
| -------- | -------- | --------------- | ------------- | ----------- | ----------- | ----------- | -------------- | ------- | --------------------------------- |
| Numeric  | Shield   | ?               | No            | No          | ?           | ?           | ?              | Shield  | Numeric                           |
| Shield   | Numeric  | ?               | No            | No          | ?           | ?           | ?              | Numeric | Shield                            |
| Shield   | Swap     | ?               | No            | No          | ?           | ?           | ?              | Swap    | Shield                            |
