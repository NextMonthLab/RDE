import { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useCreateTerminalSession } from '@/hooks/useFileSystem';
import type { TerminalOutput } from '@/types/ide';

interface TerminalProps {
  projectId: number;
}

export function Terminal({ projectId }: TerminalProps) {
  const [output, setOutput] = useState<TerminalOutput[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const createSessionMutation = useCreateTerminalSession();

  const { isConnected, sendMessage } = useWebSocket(
    sessionId ? `?sessionId=${sessionId}&projectId=${projectId}` : null,
    {
      onMessage: (data) => {
        if (data.type === 'output') {
          setOutput(prev => [...prev, {
            type: 'output',
            data: data.data,
            timestamp: new Date(),
          }]);
        } else if (data.type === 'exit') {
          setOutput(prev => [...prev, {
            type: 'output',
            data: `\nProcess exited with code ${data.code}\n`,
            timestamp: new Date(),
          }]);
        }
      },
      onOpen: () => {
        setOutput([{
          type: 'output',
          data: 'Terminal connected\n',
          timestamp: new Date(),
        }]);
      },
    }
  );

  const createNewSession = async () => {
    try {
      const result = await createSessionMutation.mutateAsync(projectId);
      setSessionId(result.sessionId);
      setOutput([]);
    } catch (error) {
      console.error('Failed to create terminal session:', error);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isConnected) return;

    // Add input to output
    setOutput(prev => [...prev, {
      type: 'input',
      data: `$ ${input}\n`,
      timestamp: new Date(),
    }]);

    // Send command to terminal
    sendMessage({ type: 'input', data: `${input}\n` });
    setInput('');
  };

  const clearTerminal = () => {
    setOutput([]);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input when terminal is clicked
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Create initial session
  useEffect(() => {
    createNewSession();
  }, [projectId]);

  return (
    <div className="h-48 bg-slate-800 border-t border-slate-700 flex flex-col">
      {/* Terminal Header */}
      <div className="bg-slate-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h4 className="text-sm font-medium text-slate-200 flex items-center">
            <TerminalIcon className="w-4 h-4 mr-2" />
            Terminal
          </h4>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          {isConnected && (
            <div className="text-xs text-green-400">Connected</div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
            onClick={clearTerminal}
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
            onClick={createNewSession}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Terminal Content */}
      <div className="flex-1 flex flex-col" onClick={handleTerminalClick}>
        <div
          ref={outputRef}
          className="flex-1 p-4 font-mono text-sm overflow-y-auto bg-slate-900 text-slate-200"
        >
          {output.length === 0 ? (
            <div className="text-slate-400">Terminal is ready...</div>
          ) : (
            output.map((line, index) => (
              <div
                key={index}
                className={`whitespace-pre-wrap ${
                  line.type === 'input' ? 'text-green-400' : 'text-slate-200'
                }`}
              >
                {line.data}
              </div>
            ))
          )}
          
          {/* Input Line */}
          {isConnected && (
            <form onSubmit={handleInputSubmit} className="flex items-center">
              <span className="text-green-400 mr-2">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-slate-200 font-mono"
                placeholder={isConnected ? "Enter command..." : "Connecting..."}
                disabled={!isConnected}
                autoFocus
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
