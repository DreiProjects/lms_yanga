
package act4;
import java.util.*;
import java.util.*;
public class Act4 {

  
    public static void main(String[] args) {
     Scanner input = new Scanner(System.in);
        Stack<Integer> stk = new Stack<Integer>();
        
         System.out.println("Enter Number: " );
        for(int i=0;i<10;i++){
            int number = input.nextInt();
            stk.push(number);
            
        }
        System.out.println("");
        System.out.println("Stacks: " + stk);
        System.out.println("Peek number of Stack: " + stk.peek());
        System.out.println("");
        System.out.println("Search for Specific Number: ");
        System.out.println("The Location  of the number is in " + stk.indexOf(input.nextInt())); 
 } 

    }
        
    
    

