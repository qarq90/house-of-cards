| Hand (A)                              | Hand (B) | Greater of Hand | Mirror Active | Echo Active | A + Sum = F | B + Sum = F | Previous Value | To Play | Previous Card Type      |
| :------------------------------------ | :------- | :-------------- | :------------ | :---------- | :---------- | :---------- | :------------- | :------ | :---------------------- |
| **Both Numeric (Standard Turns)**     |
| Numeric                               | Numeric  | ?               | No            | No          | F = Limit   | No          | ?              | A       | ?                       |
| Numeric                               | Numeric  | ?               | No            | No          | No          | F = Limit   | ?              | B       | ?                       |
| Numeric                               | Numeric  | ?               | No            | No          | F < Limit   | No          | ?              | A       | ?                       |
| Numeric                               | Numeric  | ?               | No            | No          | No          | F < Limit   | ?              | B       | ?                       |
| **Both Numeric (with Mirror)**        |
| Numeric                               | Numeric  | ?               | Yes           | No          | F = Limit   | No          | ?              | A       | ?                       |
| Numeric                               | Numeric  | ?               | Yes           | No          | No          | F = Limit   | ?              | B       | ?                       |
| Numeric                               | Numeric  | A               | Yes           | No          | F > Limit   | No          | ?              | B       | ?                       |
| Numeric                               | Numeric  | B               | Yes           | No          | No          | F > Limit   | ?              | A       | ?                       |
| Numeric                               | Numeric  | A               | Yes           | No          | F < Limit   | No          | ?              | A       | ?                       |
| Numeric                               | Numeric  | B               | Yes           | No          | No          | F < Limit   | ?              | B       | ?                       |
| Numeric                               | Numeric  | A               | Yes           | No          | No          | F > Limit   | ?              | A       | ?                       |
| Numeric                               | Numeric  | B               | Yes           | No          | F > Limit   | No          | ?              | B       | ?                       |
| **Both Numeric (with Echo)**          |
| Numeric                               | Numeric  | ?               | No            | Yes         | F = Limit   | No          | ?              | A       | ?                       |
| Numeric                               | Numeric  | ?               | No            | Yes         | No          | F = Limit   | ?              | B       | ?                       |
| Numeric                               | Numeric  | A               | No            | Yes         | F > Limit   | No          | ?              | B       | ?                       |
| Numeric                               | Numeric  | B               | No            | Yes         | No          | F > Limit   | ?              | A       | ?                       |
| Numeric                               | Numeric  | A               | No            | Yes         | F < Limit   | No          | ?              | A       | ?                       |
| Numeric                               | Numeric  | B               | No            | Yes         | No          | F < Limit   | ?              | B       | ?                       |
| Numeric                               | Numeric  | A               | No            | Yes         | No          | F > Limit   | ?              | A       | ?                       |
| Numeric                               | Numeric  | B               | No            | Yes         | F > Limit   | No          | ?              | B       | ?                       |
| **Both Numeric (with Mirror & Echo)** |
| Numeric                               | Numeric  | ?               | Yes           | Yes         | F = Limit   | No          | ?              | A       | ?                       |
| Numeric                               | Numeric  | ?               | Yes           | Yes         | No          | F = Limit   | ?              | B       | ?                       |
| Numeric                               | Numeric  | A               | Yes           | Yes         | F > Limit   | No          | ?              | B       | ?                       |
| Numeric                               | Numeric  | B               | Yes           | Yes         | No          | F > Limit   | ?              | A       | ?                       |
| Numeric                               | Numeric  | A               | Yes           | Yes         | F < Limit   | No          | ?              | A       | ?                       |
| Numeric                               | Numeric  | B               | Yes           | Yes         | No          | F < Limit   | ?              | B       | ?                       |
| Numeric                               | Numeric  | A               | Yes           | Yes         | No          | F > Limit   | ?              | A       | ?                       |
| Numeric                               | Numeric  | B               | Yes           | Yes         | F > Limit   | No          | ?              | B       | ?                       |
| **Numeric vs. Hallows**               |
| Numeric                               | Hallows  | A               | No            | No          | F > Limit   | No          | ?              | Hallows | ?                       |
| Hallows                               | Numeric  | B               | No            | No          | No          | F > Limit   | ?              | Hallows | ?                       |
| Numeric                               | Hallows  | ?               | Yes           | No          | F > Limit   | No          | ?              | Hallows | ?                       |
| Hallows                               | Numeric  | ?               | Yes           | No          | No          | F > Limit   | ?              | Hallows | ?                       |
| Numeric                               | Hallows  | ?               | No            | Yes         | F > Limit   | No          | ?              | Hallows | (duplicate check)       |
| Hallows                               | Numeric  | ?               | No            | Yes         | No          | F > Limit   | ?              | Hallows | (duplicate check)       |
| Numeric                               | Hallows  | ?               | Yes           | Yes         | F > Limit   | No          | ?              | Hallows | ?                       |
| Hallows                               | Numeric  | ?               | Yes           | Yes         | No          | F > Limit   | ?              | Hallows | ?                       |
| **Numeric vs. Specials (Standard)**   |
| Numeric                               | Shield   | ?               | No            | No          | ?           | ?           | ?              | Shield  | Numeric                 |
| Shield                                | Numeric  | ?               | No            | No          | ?           | ?           | ?              | Numeric | Shield                  |
| Numeric                               | Echo     | ?               | No            | No          | ?           | ?           | ?              | Echo    | ?                       |
| Echo                                  | Numeric  | ?               | No            | No          | ?           | ?           | ?              | Numeric | Echo                    |
| Numeric                               | Swap     | ?               | No            | No          | ?           | ?           | ?              | Swap    | ?                       |
| Swap                                  | Numeric  | ?               | No            | No          | ?           | ?           | ?              | Swap    | ?                       |
| Numeric                               | Mirror   | ?               | No            | No          | F > Limit   | No          | 0-9            | Mirror  | (First card)            |
| Mirror                                | Numeric  | ?               | No            | No          | No          | F > Limit   | 0-9            | Mirror  | (First card)            |
| **Numeric vs. Specials (with Echo)**  |
| Numeric                               | Shield   | ?               | No            | Yes         | F > Limit   | No          | ?              | Shield  | ?                       |
| Shield                                | Numeric  | ?               | No            | Yes         | No          | F > Limit   | ?              | Shield  | ?                       |
| Numeric                               | Echo     | ?               | No            | Yes         | F > Limit   | No          | ?              | Echo    | ?                       |
| Echo                                  | Numeric  | ?               | No            | Yes         | No          | F > Limit   | ?              | Echo    | ?                       |
| Numeric                               | Swap     | ?               | No            | Yes         | F > Limit   | No          | ?              | Swap    | ?                       |
| Swap                                  | Numeric  | ?               | No            | Yes         | No          | F > Limit   | ?              | Swap    | ?                       |
| Numeric                               | Mirror   | ?               | No            | Yes         | F > Limit   | No          | ?              | Mirror  | ?                       |
| Mirror                                | Numeric  | ?               | No            | Yes         | No          | F > Limit   | ?              | Mirror  | ?                       |
| **Specials vs. Hallows**              |
| Hallows                               | Shield   | ?               | No            | No          | ?           | ?           | ?              | Hallows | ?                       |
| Shield                                | Hallows  | ?               | No            | No          | ?           | ?           | ?              | Hallows | ?                       |
| Hallows                               | Echo     | ?               | No            | No          | ?           | ?           | ?              | Hallows | ?                       |
| Echo                                  | Hallows  | ?               | No            | No          | ?           | ?           | ?              | Hallows | ?                       |
| Hallows                               | Mirror   | ?               | No            | No          | ?           | ?           | ?              | Hallows | ?                       |
| Mirror                                | Hallows  | ?               | No            | No          | ?           | ?           | ?              | Hallows | ?                       |
| Hallows                               | Swap     | ?               | No            | No          | ?           | ?           | ?              | Hallows | ?                       |
| Swap                                  | Hallows  | ?               | No            | No          | ?           | ?           | ?              | Hallows | ?                       |
| **Specials vs. Specials**             |
| Hallows                               | Hallows  | ?               | No            | No          | ?           | ?           | ?              | Hallows | ?                       |
| Hallows                               | Hallows  | ?               | Yes           | No          | ?           | ?           | ?              | Hallows | ?                       |
| Hallows                               | Hallows  | ?               | No            | Yes         | ?           | ?           | ?              | Hallows | ?                       |
| Hallows                               | Hallows  | ?               | Yes           | Yes         | F = Limit   | No          | ?              | Hallows | ?                       |
| Hallows                               | Hallows  | ?               | Yes           | Yes         | F < Limit   | No          | ?              | Hallows | ?                       |
| Hallows                               | Hallows  | ?               | Yes           | Yes         | F > Limit   | No          | ?              | Hallows | ?                       |
| Shield                                | Shield   | ?               | No            | No          | ?           | ?           | ?              | Shield  | ?                       |
| Shield                                | Shield   | ?               | No            | Yes         | ?           | ?           | ?              | Shield  | ?                       |
| Echo                                  | Echo     | ?               | No            | Yes         | ?           | ?           | ?              | Echo    | Echo                    |
| Mirror                                | Mirror   | ?               | Yes           | No          | ?           | ?           | Numeric        | Mirror  | Mirror                  |
| Mirror                                | Mirror   | ?               | No            | No          | ?           | ?           | None           | Mirror  | None                    |
| Swap                                  | Swap     | ?               | No            | No          | ?           | ?           | ?              | Swap    | Swap                    |
| **Special Interactions**              |
| Shield                                | Echo     | ?               | No            | Yes         | ?           | ?           | ?              | Shield  | (Shield cancels Echo)   |
| Echo                                  | Shield   | ?               | No            | Yes         | ?           | ?           | ?              | Shield  | ?                       |
| Shield                                | Mirror   | ?               | Yes           | No          | ?           | ?           | ?              | Shield  | (Shield cancels Mirror) |
| Mirror                                | Shield   | ?               | Yes           | No          | ?           | ?           | ?              | Shield  | ?                       |
| Shield                                | Swap     | ?               | No            | No          | ?           | ?           | ?              | Swap    | Shield                  |
| Swap                                  | Shield   | ?               | No            | No          | ?           | ?           | ?              | Swap    | ?                       |
| Echo                                  | Mirror   | ?               | Yes           | Yes         | ?           | ?           | Numeric        | Mirror  | Echo                    |
| Mirror                                | Echo     | ?               | Yes           | Yes         | ?           | ?           | Numeric        | Echo    | Mirror                  |
| Echo                                  | Mirror   | ?               | No            | Yes         | ?           | ?           | None           | Mirror  | Echo                    |
| Mirror                                | Echo     | ?               | No            | No          | ?           | ?           | None           | Echo    | Mirror                  |
| Echo                                  | Swap     | ?               | No            | Yes         | ?           | ?           | ?              | Swap    | Echo                    |
| Swap                                  | Echo     | ?               | No            | No          | ?           | ?           | ?              | Echo    | Swap                    |
| Mirror                                | Swap     | ?               | Yes           | No          | ?           | ?           | ?              | Swap    | Mirror                  |
| Swap                                  | Mirror   | ?               | No            | No          | ?           | ?           | ?              | Mirror  | Swap                    |
| **Echo with Specials**                |
| Echo                                  | Hallows  | ?               | No            | Yes         | ?           | ?           | ?              | Hallows | Echo                    |
| Echo                                  | Shield   | ?               | No            | Yes         | ?           | ?           | ?              | Shield  | Echo                    |
| Echo                                  | Mirror   | ?               | No            | Yes         | ?           | ?           | ?              | Mirror  | Echo                    |
| Echo                                  | Swap     | ?               | No            | Yes         | ?           | ?           | ?              | Swap    | Echo                    |
| Echo                                  | Special  | ?               | No            | Yes         | ?           | ?           | ?              | Special | Special                 |
| Special                               | Numeric  | ?               | No            | Yes         | ?           | ?           | ?              | Numeric | Echo                    |
| **Swap with Specials**                |
| Swap                                  | Hallows  | ?               | No            | No          | ?           | ?           | ?              | Hallows | Swap                    |
| Swap                                  | Echo     | ?               | No            | No          | ?           | ?           | ?              | Echo    | Swap                    |
| Swap                                  | Mirror   | ?               | No            | No          | ?           | ?           | ?              | Mirror  | Swap                    |
