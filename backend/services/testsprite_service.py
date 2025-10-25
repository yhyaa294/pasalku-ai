"""
TestSprite MCP Service for Pasalku AI
Provides integration with TestSprite MCP for automated testing workflows.

Author: Pasalku AI Team
Date: 2025-10-25
Version: 1.0.0
"""

import os
import json
import subprocess
import logging
from typing import Dict, Any, Optional, List
from pathlib import Path

logger = logging.getLogger(__name__)


class TestSpriteMCPService:
    """
    Service class for TestSprite MCP integration.
    
    This service provides methods to interact with TestSprite MCP server
    for automated testing, code generation, and test execution.
    """
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        project: Optional[str] = None,
        config_file: Optional[str] = None
    ):
        """
        Initialize TestSprite MCP Service.
        
        Args:
            api_key: TestSprite API key (optional, reads from env if not provided)
            project: Project identifier (optional, reads from env if not provided)
            config_file: Path to MCP config file (optional)
        """
        self.api_key = api_key or os.getenv('TESTSPRITE_API_KEY')
        self.project = project or os.getenv('TESTSPRITE_PROJECT', 'mcp_pasalku')
        self.config_file = config_file or self._find_config_file()
        
        if not self.api_key:
            logger.warning("TESTSPRITE_API_KEY not found in environment variables")
        
        logger.info(f"TestSprite MCP Service initialized for project: {self.project}")
    
    def _find_config_file(self) -> Optional[str]:
        """
        Find MCP configuration file in project.
        
        Returns:
            Path to config file if found, None otherwise
        """
        possible_paths = [
            Path(__file__).parent.parent.parent / 'mcp-config.json',
            Path(__file__).parent.parent / 'mcp-config.json',
            Path.cwd() / 'mcp-config.json'
        ]
        
        for path in possible_paths:
            if path.exists():
                logger.info(f"Found MCP config at: {path}")
                return str(path)
        
        logger.warning("MCP config file not found")
        return None
    
    def _get_env(self) -> Dict[str, str]:
        """
        Get environment variables for MCP execution.
        
        Returns:
            Dictionary of environment variables
        """
        env = os.environ.copy()
        env['TESTSPRITE_API_KEY'] = self.api_key or ''
        env['TESTSPRITE_PROJECT'] = self.project
        return env
    
    def run_command(
        self,
        command: str,
        args: Optional[List[str]] = None,
        timeout: int = 60
    ) -> Dict[str, Any]:
        """
        Run a TestSprite MCP command.
        
        Args:
            command: MCP command to execute
            args: Additional arguments for the command
            timeout: Command timeout in seconds
        
        Returns:
            Dictionary containing command output and status
        """
        try:
            # Use full path to npx on Windows if available
            npx_cmd = self._get_npx_command()
            
            cmd_args = [npx_cmd, '@testsprite/testsprite-mcp@latest', command]
            if args:
                cmd_args.extend(args)
            
            logger.info(f"Running MCP command: {' '.join(cmd_args)}")
            
            result = subprocess.run(
                cmd_args,
                env=self._get_env(),
                capture_output=True,
                text=True,
                timeout=timeout,
                shell=True  # Use shell on Windows for better compatibility
            )
            
            return {
                'success': result.returncode == 0,
                'returncode': result.returncode,
                'stdout': result.stdout,
                'stderr': result.stderr,
                'command': ' '.join(cmd_args)
            }
        
        except subprocess.TimeoutExpired:
            logger.error(f"Command timeout after {timeout} seconds")
            return {
                'success': False,
                'error': 'Command timeout',
                'timeout': timeout
            }
        
        except Exception as e:
            logger.error(f"Error running MCP command: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def generate_and_execute(
        self,
        test_spec: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate code and execute tests.
        
        Args:
            test_spec: Optional test specification
        
        Returns:
            Test execution results
        """
        args = [test_spec] if test_spec else []
        return self.run_command('generateCodeAndExecute', args)
    
    def start_server(self, port: Optional[int] = None) -> Dict[str, Any]:
        """
        Start MCP server.
        
        Args:
            port: Optional port number for server
        
        Returns:
            Server start status
        """
        args = [f'--port={port}'] if port else []
        return self.run_command('server', args)
    
    def get_help(self) -> Dict[str, Any]:
        """
        Get MCP help information.
        
        Returns:
            Help text and available commands
        """
        return self.run_command('--help')
    
    def validate_config(self) -> Dict[str, bool]:
        """
        Validate MCP configuration.
        
        Returns:
            Dictionary with validation results
        """
        validation = {
            'api_key_present': bool(self.api_key),
            'config_file_exists': bool(self.config_file and os.path.exists(self.config_file)),
            'npx_available': self._check_npx_available()
        }
        
        validation['valid'] = all(validation.values())
        return validation
    
    def _check_npx_available(self) -> bool:
        """
        Check if npx is available in the system.
        
        Returns:
            True if npx is available, False otherwise
        """
        try:
            npx_cmd = self._get_npx_command()
            result = subprocess.run(
                [npx_cmd, '--version'],
                capture_output=True,
                timeout=5,
                shell=True
            )
            return result.returncode == 0
        except Exception:
            return False
    
    def _get_npx_command(self) -> str:
        """
        Get the npx command appropriate for the current OS.
        
        Returns:
            NPX command path or 'npx'
        """
        import platform
        
        if platform.system() == 'Windows':
            # Try to find npx in common locations
            possible_paths = [
                os.path.expandvars(r'%APPDATA%\npm\npx.cmd'),
                os.path.expandvars(r'%ProgramFiles%\nodejs\npx.cmd'),
                os.path.expandvars(r'%ProgramFiles(x86)%\nodejs\npx.cmd'),
            ]
            
            for path in possible_paths:
                if os.path.exists(path):
                    return path
            
            # Fallback to just 'npx' and rely on PATH
            return 'npx.cmd'
        
        return 'npx'
    
    def load_config(self) -> Optional[Dict[str, Any]]:
        """
        Load MCP configuration from file.
        
        Returns:
            Configuration dictionary or None if file doesn't exist
        """
        if not self.config_file or not os.path.exists(self.config_file):
            return None
        
        try:
            with open(self.config_file, 'r', encoding='utf-8') as f:
                config = json.load(f)
                logger.info("MCP configuration loaded successfully")
                return config
        except Exception as e:
            logger.error(f"Error loading MCP config: {str(e)}")
            return None


# Example usage and testing
if __name__ == '__main__':
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Initialize service
    service = TestSpriteMCPService()
    
    # Validate configuration
    print("\n" + "="*60)
    print("TestSprite MCP Configuration Validation")
    print("="*60)
    
    validation = service.validate_config()
    for key, value in validation.items():
        status = "✅ PASS" if value else "❌ FAIL"
        print(f"{key:30s}: {status}")
    
    # Load configuration
    print("\n" + "="*60)
    print("MCP Configuration")
    print("="*60)
    
    config = service.load_config()
    if config:
        print(json.dumps(config, indent=2))
    else:
        print("No configuration file found")
    
    # Get help
    print("\n" + "="*60)
    print("MCP Help")
    print("="*60)
    
    help_result = service.get_help()
    if help_result['success']:
        print(help_result['stdout'])
    else:
        print(f"Error: {help_result.get('error', 'Unknown error')}")
    
    print("\n" + "="*60)
    print("Service Ready!")
    print("="*60)
